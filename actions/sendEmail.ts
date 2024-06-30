'use server';

import Airtable, { FieldSet, Table } from 'airtable';
import axios from 'axios';
import qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { template } from '@/utils/emailTemplate';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type Result = {
  message: string;
  status: 'success' | 'error';
  emailCount: number;
};

type TicketRecord = {
  name: string;
  email: string;
  sentticket: boolean | undefined;
  orderid: string | number;
  [key: string]: string | number | boolean | undefined;
};

type Attendee = {
  type: string;
  orderid: string | number;
  attendee: string;
  email: string;
  code: string;
  imageUrl: string;
};

type EmailPayload = {
  to: Array<{ email: string; name: string }>;
  params: { data: Attendee[] };
  recordId: string;
};

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID as string;
const airtable = new Airtable({ apiKey: airtableApiKey });
const emailSenderApiKey = process.env.EMAIL_SECRET_KEY;
const qrFolderName = 'tpqr';
const senderEmail = process.env.EMAIL_SENDER_EMAIL;
const senderName = process.env.EMAIL_SENDER_NAME;
const emailSubject = process.env.EMAIL_SUBJECT;
const emailApiEndpoint = process.env.EMAIL_API as string;

export async function processAirtableData(tableId: string): Promise<Result> {
  try {
    const base = airtable.base(airtableBaseId);
    const table = base(tableId);
    const records = await table.select().all();

    const unsentTickets = records
      .map((record) => ({ fields: record.fields, recordId: record.id }))
      .filter((record) => !record.fields.sentticket);

    const emailPayloads = await Promise.all(
      unsentTickets.map(async ({ fields, recordId }) => {
        const { name, email, orderid, ...ticketTypes } = fields as TicketRecord;
        const attendees = await createAttendees(name, email, orderid, ticketTypes);
        return { to: [{ email, name }], params: { data: attendees }, recordId };
      })
    );

    await sendEmails(emailPayloads);
    await markTicketsAsSent(table, unsentTickets);
    await addAttendeesToAirtable(
      emailPayloads.flatMap(({ params }) => params.data),
      airtableBaseId,
      'Tickets'
    );

    return {
      status: 'success',
      emailCount: emailPayloads.length,
      message: 'Emails sent successfully',
    };
  } catch (error) {
    const message =
      (error as Error).message ||
      'Error fetching data from Airtable. Please check your table name.';
    return { status: 'error', message, emailCount: 0 };
  }
}

async function createAttendees(
  name: string,
  email: string,
  orderid: string | number,
  ticketTypes: { [key: string]: string | number | boolean | undefined }
) {
  const attendeePromises = Object.entries(ticketTypes).flatMap(async ([type, quantity]) => {
    const count = parseInt(quantity as string) || 0;
    const qrCodes = await Promise.all(
      Array(count)
        .fill(null)
        .map(() => generateQRCode())
    );
    return qrCodes.map((code) => ({
      type,
      orderid,
      attendee: name,
      email,
      ...code,
    }));
  });
  return (await Promise.all(attendeePromises)).flat();
}

async function generateQRCode(): Promise<{ code: string; imageUrl: string }> {
  const uniqueCode = uuidv4();
  const shortCode = uniqueCode.slice(0, 6);

  const qrDataUrl = await qrcode.toDataURL(shortCode, {
    errorCorrectionLevel: 'H',
    scale: 10,
  });
  const uploadResponse = await cloudinary.uploader.upload(qrDataUrl, {
    public_id: `${qrFolderName}/${uniqueCode}`,
  });

  return { code: shortCode, imageUrl: uploadResponse.url };
}

async function sendEmails(emailPayloads: EmailPayload[]): Promise<void> {
  const emailPayload = {
    sender: { email: senderEmail, name: senderName },
    subject: emailSubject,
    htmlContent: template,
    messageVersions: emailPayloads.map(({ to, params }) => ({ to, params })),
  };

  await axios.post(emailApiEndpoint, emailPayload, {
    headers: { 'api-key': emailSenderApiKey },
  });
}

async function markTicketsAsSent(
  table: Table<FieldSet>,
  unsentTickets: Array<{ recordId: string }>
) {
  await Promise.all(
    unsentTickets.map(({ recordId }) => table.update(recordId, { sentticket: true }))
  );
}

async function addAttendeesToAirtable(attendees: Attendee[], baseId: string, tableId: string) {
  const base = airtable.base(baseId);
  const table = base(tableId);
  const attendeeChunks = chunkArray(attendees, 10);

  for (const chunk of attendeeChunks) {
    await table.create(chunk.map((attendee) => ({ fields: attendee })));
  }
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
