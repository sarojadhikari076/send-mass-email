'use server';

import Airtable, { FieldSet, Table } from 'airtable';
import axios from 'axios';
import qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { template } from '@/utils/emailTemplate';
import { v2 as cloudinary } from 'cloudinary';
import { Result } from '@/types/app';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
const airtableTicketBaseId = process.env.AIRTABLE_TICKET_BASE_ID as string;
const airtableIssueBaseId = process.env.AIRTABLE_ISSUES_BASE_ID as string;
const airtable = new Airtable({ apiKey: airtableApiKey });
const emailSenderApiKey = process.env.EMAIL_SECRET_KEY;
const qrFolderName = 'tpqr';
const senderEmail = process.env.EMAIL_SENDER_EMAIL;
const senderName = process.env.EMAIL_SENDER_NAME;
const emailSubject = process.env.EMAIL_SUBJECT;
const emailApiEndpoint = process.env.EMAIL_API as string;
const websiteBaseUrl = process.env.WEBSITE_BASE_URL;

export async function processAirtableData(tableId: string): Promise<Result> {
  try {
    const base = airtable.base(airtableTicketBaseId);
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

    await addAttendeesToAirtable(
      emailPayloads.flatMap(({ params }) => params.data),
      airtableTicketBaseId,
      'Tickets'
    );
    await markTicketsAsSent(table, unsentTickets);
    await sendEmails(emailPayloads);

    return {
      status: 'success',
      message: 'Emails sent successfully',
    };
  } catch (error) {
    console.log(error);
    const message =
      (error as Error).message ||
      'Error fetching data from Airtable. Please check your table name.';
    return { status: 'error', message };
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

export const generateCompanyQRCode = async (formData: FormData) => {
  const uniqueCode = uuidv4().slice(0, 6);

  const reportUrl = `${websiteBaseUrl}/report?code=${uniqueCode}`;

  try {
    const qrDataUrl = await qrcode.toDataURL(reportUrl, { errorCorrectionLevel: 'H' });

    const uploadResponse = await cloudinary.uploader.upload(qrDataUrl, {
      public_id: `${qrFolderName}/${uniqueCode}`,
    });

    const fieldSet: FieldSet = {
      locationtype: formData.get('locationtype') as string,
      operator: formData.get('operator') as string,
      email: formData.get('email') as string,
      contact: formData.get('phone') as string,
      w3w: formData.get('what3words') as string,
      qrcode: uploadResponse.url as string,
      locationid: uniqueCode,
    };

    // Add the data to Airtable
    const base = airtable.base(airtableIssueBaseId);
    const table = base('Location');

    await table.create([
      {
        fields: fieldSet,
      },
    ]);

    return { status: 'success', message: 'QR Code generated successfully' };
  } catch (error) {
    console.log(error);
    return { status: 'error', message: 'Error generating QR Code' };
  }
};

export const reportIssue = async (formData: FormData) => {
  const base = airtable.base(airtableIssueBaseId);
  const uniqueCode = formData.get('code') as string;
  const issueType = formData.get('issueType') as string;
  const issue = formData.get('issue') as string;
  const image = formData.get('image') as File;

  const reportRecord = await base('Location')
    .select({
      filterByFormula: `{locationid} = '${uniqueCode}'`,
    })
    .firstPage();

  if (reportRecord.length === 0) {
    return { status: 'error', message: 'Location not found. Please re-scan the QR code.' };
  }

  const location = reportRecord.map((record) => record.fields)[0];

  try {
    const table = base('Reports');
    let imageUrl = '';

    if (image && image.size > 0) {
      const imageToDataURL = async (image: File): Promise<string> => {
        const fileBuffer = await image.arrayBuffer();
        const base64String = Buffer.from(fileBuffer).toString('base64');
        const mimeType = image.type;
        return `data:${mimeType};base64,${base64String}`;
      };

      const imageDataURL = await imageToDataURL(image);

      const uploadResponse = await cloudinary.uploader.upload(imageDataURL, {
        public_id: `${qrFolderName}/${uniqueCode}/${uuidv4()}`,
      });

      imageUrl = uploadResponse.url;
    }

    await table.create([
      {
        fields: {
          issuetype: issueType === 'Other' ? issue : issueType,
          contact: location.contact,
          locationtype: location.locationtype,
          w3w: location.w3w,
          operator: location.operator,
          image: imageUrl,
        },
      },
    ]);

    if (location.contact) {
      const msgText = `New issue reported at ${location.w3w}. - ${issueType} - ${issue}`;
      await sendSMS(location.contact as string, msgText);
    }

    return { status: 'success', message: 'Issue reported successfully' };
  } catch (error) {
    console.log(error);
    const result: Result = { status: 'error', message: 'Error reporting issue' };
    return result;
  }
};

export const sendSMS = async (phone: string, msg: string) => {
  const smsApiEndpoint = process.env.SMS_API_ENDPOINT as string;
  const smsApiKey = process.env.SMS_API_KEY;
  try {
    await axios.post(
      smsApiEndpoint,
      {
        to: phone,
        from: 'EIR System',
        msg,
      },
      {
        headers: {
          Authorization: `Bearer ${smsApiKey}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
