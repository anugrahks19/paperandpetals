import { Header, Footer } from "../page";
import BookingForm from "./booking-form";
export default async function BookPage({searchParams}:{searchParams:Promise<{product?:string}>}){
  const params=await searchParams;
  return <main><Header/><div className="page-wrap"><div className="page-title"><span className="eyebrow">A LITTLE SOMETHING, JUST FOR YOU</span><h1>Let’s make it <em>personal.</em></h1><p>Share your idea below. This is a booking request; we’ll confirm the details and final price with you.</p></div><div className="booking-layout"><BookingForm initialProduct={params.product || ""}/><aside className="booking-aside"><img src="/images/craft-collection-v2.webp" alt="Original examples of crochet, pebble art, stitched bookmarks and patchwork"/><div className="aside-content"><h3>Made for your moment.</h3><p>Every request is planned individually so the result feels like it could only be yours.</p><ul><li>Tell us what you have in mind</li><li>We’ll reply to discuss design and price</li><li>Making begins after confirmation</li></ul><p>Pricing, delivery and timing depend on your design and location.</p></div></aside></div></div><Footer/></main>;
}

