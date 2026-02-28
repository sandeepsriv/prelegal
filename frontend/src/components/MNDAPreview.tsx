import { MNDAFormData } from "@/lib/types";

interface Props {
  data: MNDAFormData;
}

function formatDate(iso: string): string {
  if (!iso) return "[Date]";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function MNDAPreview({ data }: Props) {
  const {
    purpose,
    effectiveDate,
    mndaTermType,
    mndaTermYears,
    confidentialityTermType,
    confidentialityTermYears,
    governingLaw,
    jurisdiction,
    party1,
    party2,
  } = data;

  const termText =
    mndaTermType === "expires"
      ? `Expires ${mndaTermYears} year${Number(mndaTermYears) !== 1 ? "s" : ""} from Effective Date.`
      : "Continues until terminated in accordance with the terms of the MNDA.";

  const confidentialityText =
    confidentialityTermType === "fixed"
      ? `${confidentialityTermYears} year${Number(confidentialityTermYears) !== 1 ? "s" : ""} from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
      : "In perpetuity.";

  return (
    <div className="font-serif text-sm leading-relaxed text-gray-900 max-w-3xl mx-auto">
      {/* Cover Page */}
      <h1 className="text-2xl font-bold text-center mb-6">
        Mutual Non-Disclosure Agreement
      </h1>

      <p className="mb-4 text-xs text-gray-600">
        This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists
        of: (1) this Cover Page and (2) the Common Paper Mutual NDA Standard
        Terms Version 1.0. Any modifications of the Standard Terms should be
        made on the Cover Page, which will control over conflicts with the
        Standard Terms.
      </p>

      <div className="space-y-5 mb-8">
        <section>
          <h2 className="font-bold text-base border-b border-gray-300 pb-1 mb-2">
            Purpose
          </h2>
          <p className="text-xs text-gray-500 italic mb-1">
            How Confidential Information may be used
          </p>
          <p>{purpose || "[Purpose]"}</p>
        </section>

        <section>
          <h2 className="font-bold text-base border-b border-gray-300 pb-1 mb-2">
            Effective Date
          </h2>
          <p>{formatDate(effectiveDate)}</p>
        </section>

        <section>
          <h2 className="font-bold text-base border-b border-gray-300 pb-1 mb-2">
            MNDA Term
          </h2>
          <p className="text-xs text-gray-500 italic mb-1">
            The length of this MNDA
          </p>
          <p>{termText}</p>
        </section>

        <section>
          <h2 className="font-bold text-base border-b border-gray-300 pb-1 mb-2">
            Term of Confidentiality
          </h2>
          <p className="text-xs text-gray-500 italic mb-1">
            How long Confidential Information is protected
          </p>
          <p>{confidentialityText}</p>
        </section>

        <section>
          <h2 className="font-bold text-base border-b border-gray-300 pb-1 mb-2">
            Governing Law &amp; Jurisdiction
          </h2>
          <p>
            <strong>Governing Law:</strong> {governingLaw || "[State]"}
          </p>
          <p>
            <strong>Jurisdiction:</strong> {jurisdiction || "[Jurisdiction]"}
          </p>
        </section>

        {/* Signature block */}
        <section>
          <h2 className="font-bold text-base border-b border-gray-300 pb-1 mb-3">
            Signatures
          </h2>
          <div className="grid grid-cols-2 gap-6 text-sm">
            {[
              { label: "Party 1", party: party1 },
              { label: "Party 2", party: party2 },
            ].map(({ label, party }) => (
              <div key={label} className="border border-gray-200 p-3 rounded">
                <p className="font-semibold mb-2 text-center">{label}</p>
                <div className="space-y-2">
                  <div className="border-b border-gray-300 pb-4 mb-1">
                    <p className="text-xs text-gray-400">Signature</p>
                  </div>
                  <p>
                    <span className="text-xs text-gray-400">Print Name: </span>
                    {party.name || "_______________"}
                  </p>
                  <p>
                    <span className="text-xs text-gray-400">Title: </span>
                    {party.title || "_______________"}
                  </p>
                  <p>
                    <span className="text-xs text-gray-400">Company: </span>
                    {party.company || "_______________"}
                  </p>
                  <p>
                    <span className="text-xs text-gray-400">
                      Notice Address:{" "}
                    </span>
                    {party.noticeAddress || "_______________"}
                  </p>
                  <p>
                    <span className="text-xs text-gray-400">Date: </span>
                    {"_______________"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Standard Terms */}
      <div className="border-t-2 border-gray-400 pt-6">
        <h2 className="text-xl font-bold text-center mb-4">Standard Terms</h2>

        <ol className="list-decimal list-outside pl-5 space-y-4 text-sm">
          <li>
            <strong>Introduction.</strong> This Mutual Non-Disclosure Agreement
            (which incorporates these Standard Terms and the Cover Page)
            (&ldquo;MNDA&rdquo;) allows each party (&ldquo;Disclosing
            Party&rdquo;) to disclose or make available information in
            connection with the <em>{purpose || "[Purpose]"}</em> which (1) the
            Disclosing Party identifies to the receiving party (&ldquo;Receiving
            Party&rdquo;) as &ldquo;confidential&rdquo;,
            &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably
            understood as confidential or proprietary due to its nature and the
            circumstances of its disclosure (&ldquo;Confidential
            Information&rdquo;). Each party&rsquo;s Confidential Information
            also includes the existence and status of the parties&rsquo;
            discussions and information on the Cover Page.
          </li>
          <li>
            <strong>Use and Protection of Confidential Information.</strong> The
            Receiving Party shall: (a) use Confidential Information solely for
            the <em>{purpose || "[Purpose]"}</em>; (b) not disclose Confidential
            Information to third parties without the Disclosing Party&rsquo;s
            prior written approval, except that the Receiving Party may disclose
            Confidential Information to its employees, agents, advisors,
            contractors and other representatives having a reasonable need to
            know; and (c) protect Confidential Information using at least the
            same protections the Receiving Party uses for its own similar
            information but no less than a reasonable standard of care.
          </li>
          <li>
            <strong>Exceptions.</strong> The Receiving Party&rsquo;s obligations
            do not apply to information that: (a) is or becomes publicly
            available through no fault of the Receiving Party; (b) it rightfully
            knew or possessed prior to receipt without confidentiality
            restrictions; (c) it rightfully obtained from a third party without
            confidentiality restrictions; or (d) it independently developed
            without using or referencing the Confidential Information.
          </li>
          <li>
            <strong>Disclosures Required by Law.</strong> The Receiving Party
            may disclose Confidential Information to the extent required by law,
            provided (to the extent legally permitted) it provides the
            Disclosing Party reasonable advance notice and reasonably cooperates
            with efforts to obtain confidential treatment.
          </li>
          <li>
            <strong>Term and Termination.</strong> This MNDA commences on{" "}
            {formatDate(effectiveDate)} and{" "}
            {mndaTermType === "expires"
              ? `expires ${mndaTermYears} year${Number(mndaTermYears) !== 1 ? "s" : ""} from the Effective Date`
              : "continues until terminated"}
            . Either party may terminate this MNDA for any or no reason upon
            written notice to the other party. The Receiving Party&rsquo;s
            obligations relating to Confidential Information will survive for{" "}
            {confidentialityText.toLowerCase()}
          </li>
          <li>
            <strong>Return or Destruction of Confidential Information.</strong>{" "}
            Upon expiration or termination, the Receiving Party will: (a) cease
            using Confidential Information; (b) promptly destroy or return all
            Confidential Information; and (c) if requested, confirm compliance
            in writing.
          </li>
          <li>
            <strong>Proprietary Rights.</strong> The Disclosing Party retains
            all intellectual property and other rights in its Confidential
            Information and its disclosure grants no license under such rights.
          </li>
          <li>
            <strong>Disclaimer.</strong> ALL CONFIDENTIAL INFORMATION IS
            PROVIDED &ldquo;AS IS&rdquo;, WITH ALL FAULTS, AND WITHOUT
            WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE,
            MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
          </li>
          <li>
            <strong>Governing Law and Jurisdiction.</strong> This MNDA is
            governed by the laws of the State of{" "}
            <strong>{governingLaw || "[State]"}</strong>. Any legal proceedings
            must be instituted in the courts located in{" "}
            <strong>{jurisdiction || "[Jurisdiction]"}</strong>.
          </li>
          <li>
            <strong>Equitable Relief.</strong> A breach of this MNDA may cause
            irreparable harm for which monetary damages are an insufficient
            remedy. The Disclosing Party is entitled to seek appropriate
            equitable relief, including an injunction.
          </li>
          <li>
            <strong>General.</strong> Neither party may assign this MNDA without
            prior written consent, except in connection with a merger,
            reorganization, acquisition or transfer of all or substantially all
            assets or voting securities. This MNDA constitutes the entire
            agreement of the parties with respect to its subject matter.
          </li>
        </ol>

        <p className="mt-6 text-xs text-gray-400 text-center">
          Common Paper Mutual Non-Disclosure Agreement Version 1.0 — free to
          use under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            className="underline"
          >
            CC BY 4.0
          </a>
        </p>
      </div>
    </div>
  );
}
