import Image from 'next/image';

function Navbar() {
  return (
    <div className="flex items-center w-full gap-2 justify-center">
      <Image
        src="/vegan-campout-logo.png"
        alt="Logo"
        width={80}
        height={80}
        className="object-cover"
      />
    </div>
  );
}

export default Navbar;
