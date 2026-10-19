import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Paper & Petals | Handmade Cards, Art & Personalised Gifts",description:"Thoughtful handmade cards, mini paintings and personalised gift boxes, made to order with love in India.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
