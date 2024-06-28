import UploadImage from "@/components/UploadImage";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center pt-12 px-6 sm:pt-36 sm:px-6 lg:px-8">
      <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight lg:text-5xl">
        Upload your festival image
      </h1>
      <UploadImage />
    </div>
  );
}
