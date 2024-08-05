import Image from "next/image";

interface EmptyProps {
  label: string;
}

const Empty = () => {
  return (
    <div className="h-full pt-5 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72 flex flex-col justify-center items-center">
        <Image alt="Empty" src="/empty.png" width={"200"} height={"200"} />
        <p className="mt-10">No conversation started</p>
      </div>
    </div>
  );
};

export default Empty;
