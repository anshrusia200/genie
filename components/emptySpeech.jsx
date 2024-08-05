import Image from "next/image";

const EmptySpeech = () => {
  return (
    <div className="h-full pt-5 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72 flex flex-col justify-center items-center">
        <Image alt="Empty" src="/speech.png" width={"250"} height={"250"} />
        <p className="mt-10">No Speech generated yet</p>
      </div>
    </div>
  );
};

export default EmptySpeech;
