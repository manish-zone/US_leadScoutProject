// Script generator tailored for US prospects without websites

export function generateOutreachScripts(lead) {
  const contactName = lead.ownerName ? lead.ownerName.split(' ')[0] : 'there';
  const categoryLabel = 
    lead.category === 'hotel' ? 'lodge/motel' : 
    lead.category === 'shop' ? 'retail store' : 'contracting business';

  // 1. Cold Call Script (English)
  const coldCallScript = `
"Hi ${contactName}, my name is [Your Name]. I came across ${lead.name} on Google Maps in ${lead.city} and was really impressed by your ${lead.rating}-star rating with over ${lead.reviewsCount} reviews!

The reason for my call: I noticed when prospective customers look for your official website to ${lead.category === 'hotel' ? 'check room rates and book directly' : lead.category === 'shop' ? 'view your catalog and place orders' : 'request estimates and quotes'}, there isn't an active website listed. 

Right now, ${lead.category === 'hotel' ? 'third-party booking platforms are taking 15% to 20% commission on every single guest' : 'potential customers searching on their phones might be defaulting to your local competitors who have quick online forms'}.

We help ${lead.category === 'hotel' ? 'independent hotels and lodges' : lead.category === 'shop' ? 'local specialty retailers' : 'contractors and service companies'} build fast, modern, mobile-friendly websites with ${lead.category === 'hotel' ? 'direct reservation systems' : lead.category === 'shop' ? 'online product showcases & order pick-up' : 'instant quote request forms'} in under 7 days.

I already built a rough 1-page visual preview tailored for ${lead.name}. Would you be open to taking a look at it over a quick 5-minute screen share or should I send a preview link over text/email?"
`.trim();

  // 2. Hinglish Calling Strategy & Tips (Caller Guide)
  const callerGuideHinglish = `
🎯 **Targeting Angle for ${lead.name} (${lead.city}, ${lead.state}):**
1. **Hook:** Call start karte hi unki Google rating (${lead.rating}⭐, ${lead.reviewsCount} reviews) appreciate karo. Isse trust banta hai aur wo defend nahi karte.
2. **Pain Point:** Unhe remind karao ki ${lead.pitchAngle}
3. **Offer:** Direct bolna hai ki aapne unke business ka ek modern responsive website prototype / demo tayyar kiya hai jo unhe commission bachane aur direct clients lane me madad karega.
4. **Objection: "We get enough word-of-mouth already":**
   - Bolna: *"That's exactly why you have ${lead.rating} stars! Lekin jab log Google pe aapko dhundte hain aur website nahi milti, toh wo call drop kar dete hain ya competitors ke paas chale jaate hain. Ye site aapke repeat customers ko retain karegi."*
5. **Pricing Strategy:** US clients ke liye standard website package: $800 - $2,500 USD (one-time) + $50-$100/mo maintenance/hosting.
`.trim();

  // 3. Cold Email Template
  const emailSubject = `Quick question regarding ${lead.name} website & direct reservations`;
  const emailBody = `
Hi ${contactName},

I was researching top-rated ${categoryLabel}s in ${lead.city}, ${lead.state} and came across ${lead.name}. With a stellar ${lead.rating}-star rating and ${lead.reviewsCount}+ reviews on Google, you've clearly built an incredible reputation.

However, I noticed your Google business profile doesn't have an active website attached yet.

Because of this:
- ${lead.pitchAngle}
- Customers on smartphones searching for "${lead.name}" don't have a direct way to view photos, pricing, or submit inquiries.

We recently developed a clean, modern website concept specifically for ${lead.name} that includes:
✅ Fast mobile-optimized design
✅ ${lead.category === 'hotel' ? 'Direct booking & reservation engine (zero commission)' : lead.category === 'shop' ? 'Interactive product catalog & local pickup ordering' : 'Instant 24/7 estimate & service quote form'}
✅ Automated Google reviews sync and maps integration

Would you be open to seeing a 2-minute video preview of how it looks? 

Best regards,

[Your Name]
[Your Agency Name / Portfolio Link]
[Your Phone Number]
`.trim();

  // 4. Quick SMS / Text Message Pitch
  const smsBody = `Hi ${contactName}, love what you've built at ${lead.name} in ${lead.city}! Noticed you don't have an official website listed on Google yet. I put together a quick, modern prototype for you with ${lead.category === 'hotel' ? 'direct commission-free booking' : 'online quote requests'}. Can I text you a quick preview link? - [Your Name]`;

  return {
    coldCallScript,
    callerGuideHinglish,
    emailSubject,
    emailBody,
    smsBody
  };
}

