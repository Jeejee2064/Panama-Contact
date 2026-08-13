import { getTranslations } from 'next-intl/server';

// Shared rich-text styling for HTML content stored in messages/*.json
// (no Tailwind typography plugin installed, so headings/lists are styled explicitly here)
const RICH_TEXT =
  '[&_p]:mb-4 [&_p:last-child]:mb-0 ' +
  '[&_h3]:font-[Gravesend] [&_h3]:text-sm [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:text-[#324158] [&_h3]:mt-5 [&_h3]:mb-2 [&_h3:first-child]:mt-0 ' +
  '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1 ' +
  '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-1 ' +
  '[&_strong]:text-[#324158] [&_strong]:font-semibold ' +
  '[&_a]:text-[#FF491A] [&_a]:underline [&_a]:decoration-[#FF491A]/40 hover:[&_a]:decoration-[#FF491A]';

export default async function LegalDocument({ locale, namespace }) {
  const t = await getTranslations({ locale, namespace });
  const sections = t.raw('sections') ?? [];

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-[Gravesend] text-[#324158] mb-2 uppercase">{t('heading')}</h1>
        <p className="text-xs text-gray-400 mb-8">{t('lastUpdated')}</p>

        <div
          className={`text-[#324158]/70 leading-relaxed mb-10 ${RICH_TEXT}`}
          dangerouslySetInnerHTML={{ __html: t.raw('intro') }}
        />

        {sections.map((section, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-lg font-[Gravesend] text-[#324158] mb-2">{section.heading}</h2>
            <div
              className={`text-[#324158]/70 leading-relaxed text-sm ${RICH_TEXT}`}
              dangerouslySetInnerHTML={{ __html: section.body }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
