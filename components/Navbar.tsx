import Image from 'next/image';

function Navbar() {
  return (
    <div className="flex items-center w-full gap-2 justify-center">
      <Image
        src="/vegan-campout-logo.png"
        alt="Logo"
        width={32}
        height={32}
        className="object-contain"
      />
      <h3 className="text-sm text-black font-bold">Vegan Camp Out 2024</h3>
    </div>
  );
}

export default Navbar;
