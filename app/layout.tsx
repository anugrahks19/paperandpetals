import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Paper & Petals | Crochet, Pebble Art & Handmade Keepsakes",description:"Made-to-order crochet book covers, embroidered bookmarks, personalised pebble and shell art, and patchwork pouches from an Indian handmade studio.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
