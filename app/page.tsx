
import { ArrowRight, Flower2, Heart, Sparkles } from "lucide-react";
import "./marquee.css";

export function Header() {
  return <header className="header"><a href="/" className="brand"><Flower2 size={27} strokeWidth={1.4}/><span>paper <em>&</em> petals<small>HANDMADE STUDIO</small></span></a><nav><a href="/#collection">Collection</a><a href="/#story">Our story</a><a href="/#process">How it works</a></nav><a href="/book" className="header-button">Book a creation <ArrowRight size={16}/></a></header>;
}
export function Footer() {
  return <footer className="footer"><div><div className="brand"><Flower2 size={28}/><span>paper <em>&</em> petals<small>HANDMADE STUDIO</small></span></div><p>Little creations, lasting memories.</p></div><div className="footer-links"><a href="/#collection">Collection</a><a href="/#process">How it works</a><a href="/book">Custom booking</a></div><div className="copyright">© 2026 Paper & Petals · Made with care in India</div></footer>;
}
const products = [
  {title:"Crochet for everyday",product:"Crochet book cover",description:"Flowered book covers, page markers, bags and tiny accessories made stitch by stitch.",image:"/images/craft-collection-v2.webp",position:"20% 44%"},
  {title:"Pebble portraits",product:"Personalised pebble art",description:"Families, friends and beloved pets imagined in stones, twigs and tiny inked details.",image:"/images/pebble-art-v2.webp",position:"50% 50%"},
  {title:"Stitched little things",product:"Embroidered felt bookmark",description:"Floral felt bookmarks and colourful leaf-shaped patchwork pouches sewn with care.",image:"/images/stitched-keepsakes-v2.webp",position:"50% 50%"},
  {title:"Seaside keepsakes",product:"Shell and seaside art",description:"Shells, pebbles and sea glass arranged into playful animals, letters and framed scenes.",image:"/images/craft-collection-v2.webp",position:"83% 33%"}
];
export default function Home() {
  return <main><Header/>
    <section className="hero"><div className="hero-copy"><span className="eyebrow">A LITTLE STUDIO OF BIG FEELINGS</span><h1>Made by hand.<br/><em>Kept by heart.</em></h1><p>Crochet, stitched keepsakes and nature-inspired art, made one piece at a time for your favourite people.</p><div className="hero-actions"><a href="/book" className="button button-dark">Make something special <ArrowRight size={18}/></a><a href="#collection" className="under-link">Explore the collection ↗</a></div><div className="hero-note"><Heart size={15} fill="currentColor"/> Designed with love, made to order in India</div></div><div className="hero-visual"><img src="/images/craft-collection-v2.webp" alt="Original examples of crochet, pebble art, shell art, embroidered bookmarks and patchwork"/><div className="hero-seal">little things<br/><strong>mean the most</strong><Sparkles size={18}/></div></div></section>
<div className="ribbon" aria-label="Made with love, created for you, small moments, big feelings">
  <div className="ribbon-track">
    {[0, 1].map((copy) => (
      <div className="ribbon-group" key={copy} aria-hidden={copy === 1}>
        {[
          "MADE WITH LOVE",
          "CREATED FOR YOU",
          "SMALL MOMENTS, BIG FEELINGS",
          "MADE WITH LOVE",
          "CREATED FOR YOU",
        ].map((phrase, index) => (
          <span key={index}>{phrase}<b aria-hidden="true">✳</b></span>
        ))}
      </div>
    ))}
  </div>
</div>
    <section className="section collection" id="collection"><div className="section-head"><div><span className="eyebrow">THE LITTLE COLLECTION</span><h2>Gifts with a <em>human touch.</em></h2></div><p>From yarn and fabric to pebbles and shells, each piece begins with a feeling. Pick a starting point and make it yours.</p></div><div className="product-grid">{products.map((p,i)=><article className="product" key={p.title}><div className="product-image"><img src={p.image} alt={"Original visual example of " + p.title.toLowerCase()} style={{objectPosition:p.position}}/><span>0{i+1} / 04</span></div><div className="product-info"><div><h3>{p.title}</h3><p>{p.description}</p><strong>Made to order</strong></div><a href={"/book?product="+encodeURIComponent(p.product)} aria-label={"Request "+p.title} className="round-arrow"><ArrowRight size={20}/></a></div></article>)}</div><p className="disclaimer">Images are creative examples of the craft style. Your finished piece and quote will be confirmed before making.</p></section>
    <section className="story" id="story"><div className="story-photo"><img src="/images/stitched-keepsakes-v2.webp" alt="Original examples of embroidered felt bookmarks and patchwork pouches"/><span>a little art, a lot of heart</span></div><div className="story-copy"><span className="eyebrow">FROM OUR HANDS TO YOURS</span><h2>For all the things<br/>you <em>feel,</em> but can’t<br/>quite say.</h2><p>Some moments deserve more than something picked off a shelf. Paper & Petals is a small handmade studio for crochet, embroidered fabric and keepsakes made from the little treasures nature gives us.</p><p>Tell us the person, the occasion and the feeling. We’ll bring it together with thread, texture and plenty of care.</p><a href="/book" className="button button-outline">Tell us your idea <ArrowRight size={18}/></a></div></section>
    <section className="section process" id="process"><span className="eyebrow">SIMPLE AS ONE, TWO, THREE</span><h2>Your idea, <em>beautifully made.</em></h2><div className="steps"><div><span>01</span><h3>Share your idea</h3><p>Choose a product and tell us about the occasion, colours and personal details.</p></div><div><span>02</span><h3>Plan together</h3><p>We’ll confirm the design, price and timeline before any making begins.</p></div><div><span>03</span><h3>Made just for you</h3><p>Your piece is crafted by hand, thoughtfully packed and prepared for delivery.</p></div></div></section>
    <section className="closing"><span className="asterisk">✳</span><span className="eyebrow">LET’S MAKE SOMEONE SMILE</span><h2>Have a little idea?<br/><em>Let’s make it lovely.</em></h2><p>Birthdays, anniversaries, thank-yous, or just because—tell us what you imagine.</p><a href="/book" className="button button-light">Start a custom request <ArrowRight size={18}/></a></section><Footer/></main>;
}



