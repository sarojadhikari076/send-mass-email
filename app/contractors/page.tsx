import CreateContractorForm from '@/components/CreateContractorForm';

export const metadata = {
  title: 'Create Contractors',
  description: 'Create contractors for the event',
};

function CreateContractors() {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md p-4">
      <div>
        <h1 className="text-xl font-bold text-green-500">Add a site location</h1>
        <p className="text-gray-600 text-sm">
          Use this form to generate a QR code poster for your site location.
        </p>
      </div>
      <hr className="border-gray-200 my-2" />
      <CreateContractorForm />
    </div>
  );
}

export default CreateContractors;
