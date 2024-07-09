import FestivalCards from "@/components/FestivalCards";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center pt-12 px-6 sm:pt-32 sm:px-6 lg:px-8">
      <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Discover Your Festival Playlist
      </h1>
      
      <p className="text-xl text-center mb-12 max-w-2xl">
        Explore upcoming festivals and create a personalized playlist featuring your favorite artists performing at each event.
      </p>

      <FestivalCards />
      
      <p className="text-lg leading-7 mt-8 text-center max-w-2xl">
        Click on a festival to start curating your unique music experience. Let the countdown to your perfect festival soundtrack begin!
      </p>
    </div>
  );
}