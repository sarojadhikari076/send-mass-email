import ReportIssueForm from '@/components/ReportIssueForm';

function ReportIssuePage({ searchParams }: { searchParams: { code: string } }) {
  return <ReportIssueForm code={searchParams.code} />;
}

export default ReportIssuePage;
