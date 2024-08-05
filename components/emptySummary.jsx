import Image from "next/image";

const EmptySummary = () => {
  return (
    <div className="h-full pt-5 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72 flex flex-col justify-center items-center">
        <Image alt="Empty" src="/summary.png" width={"200"} height={"200"} />
        <p className="mt-10">No Summary generated</p>
      </div>
    </div>
  );
};

export default EmptySummary;
