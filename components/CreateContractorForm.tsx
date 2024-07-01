'use client';
import { generateCompanyQRCode } from '@/actions/sendEmail';
import React from 'react';
import Message from './Message';
import { Result } from '@/types/app';

function CreateContractorForm() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Result>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData(e.currentTarget);
      const response = await generateCompanyQRCode(data);
      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {result && <Message result={result} />}
      <div>
        <label htmlFor="operator" className="label">
          Operator / Name <br />
          <span className="sub-label">Who is the operator of this location/activity</span>
        </label>
        <input
          type="text"
          name="operator"
          id="operator"
          required
          className="input"
          placeholder="eg: John Doe"
        />
      </div>

      <div>
        <label htmlFor="locationtype" className="label">
          What type of location is this
          <br />
          <span className="sub-label">eg: Toilet / Showers / Water Tap / Security</span>
        </label>
        <input
          type="text"
          name="locationtype"
          id="locationtype"
          required
          className="input"
          placeholder="eg: Toilet"
        />
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email Address
          <br />
          <span className="sub-label">
            Email address of the contractor if they would like to be notified of the issues via
            email.
          </span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="input"
          placeholder="eg: johndoe@gmail.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="label">
          Phone Number
          <br />
          <span className="sub-label">
            Phone number of the responsible person for this location for them to be notified of the
            issues via Whatsapp.
          </span>
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          required
          className="input"
          placeholder="eg: +1234567890"
        />
      </div>

      <div>
        <label htmlFor="what3words" className="label">
          What 3 Words / Describe location on site
          <br />
          <span className="sub-label">
            Enter the whatthreewords of this location so it can be used to locate exact point on the
            map.
          </span>
        </label>
        <input
          type="text"
          name="what3words"
          id="what3words"
          required
          className="input"
          placeholder="eg: ///filled.count.soap"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Generating QR Code...' : 'Generate QR Code'}
      </button>
    </form>
  );
}

export default CreateContractorForm;
