export function DemoVideo() {
  return (
    <section className="flex justify-center px-4 py-12">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full max-w-5xl rounded-2xl border"
      >
        <source src="/previewcn-demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
