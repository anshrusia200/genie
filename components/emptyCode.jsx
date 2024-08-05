import Image from "next/image";

const EmptyCode = () => {
  return (
    <div className="h-full pt-5 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72 flex flex-col justify-center items-center">
        <Image alt="Empty" src="/code.png" width={"200"} height={"200"} />
        <p className="mt-10">No Code generated yet</p>
      </div>
    </div>
  );
};

export default EmptyCode;
