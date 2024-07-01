'use client';

import React from 'react';
import { reportIssue } from '@/actions/sendEmail';
import { Result } from '@/types/app';
import Message from './Message';

const issues = [
  'No water',
  'Toilet is blocked',
  'Out of toilet paper',
  'Shower is not working',
  'Security issue',
  'No electricity',
  'No staff',
  'Other',
];

function ReportIssueForm({ code }: { code: string }) {
  const [issueType, setIssueType] = React.useState(issues[0]);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Result>();

  async function handleReportIssue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(undefined);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await reportIssue(formData);
      setResult(response);
    } catch (error) {
      alert('Error reporting issue. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
      e.currentTarget.reset();
    }
  }

  return (
    <div className="mx-auto max-w-md bg-white shadow sm:rounded-md p-4">
      <h1 className="text-2xl font-bold text-green-500">Report an issue</h1>
      <p className="text-sm text-gray-600 mb-2">
        Let us know about the issue below at this facility.
      </p>
      {result && <Message result={result} />}
      <hr className="my-3 border-gray-200" />
      <form
        onSubmit={handleReportIssue}
        encType="multipart/formdata"
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="code" value={code} />
        <div>
          <label htmlFor="issueType" className="label">
            Issue Type
          </label>
          <select
            name="issueType"
            id="issueType"
            className="input"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
          >
            {issues.map((issue) => (
              <option key={issue} value={issue}>
                {issue}
              </option>
            ))}
          </select>
          {issueType === 'Other' && (
            <input
              type="text"
              name="issue"
              id="issue"
              required
              className="input mt-4"
              placeholder="Please specify the issue"
            />
          )}
        </div>
        <div>
          <label htmlFor="image" className="label">
            Upload Image
          </label>
          <input type="file" name="image" id="image" className="input" />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Reporting issue...' : 'Report Issue'}
        </button>
      </form>
    </div>
  );
}

export default ReportIssueForm;
