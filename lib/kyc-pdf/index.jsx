import { Document, renderToBuffer } from '@react-pdf/renderer';
import { NaturalPersonPage, LegalEntityPage } from './forms';

// One PDF per submission: the Spanish form first, then the English form, both filled in.
function KycPdf({ row }) {
  const Form = row.client_type === 'legal' ? LegalEntityPage : NaturalPersonPage;
  return (
    <Document title={`KYC - ${row.display_name || ''}`} author="Panama Contact">
      <Form row={row} lang="es" />
      <Form row={row} lang="en" />
    </Document>
  );
}

export function renderKycPdf(row) {
  return renderToBuffer(<KycPdf row={row} />);
}
