import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { tokens } from '@optiaxiom/globals';

// @react-pdf/renderer can't parse `light-dark(...)` CSS values, so we extract
// the light-mode hex out of each semantic Axiom token.
const lightValue = (token) => {
  const match = /^light-dark\(\s*([^,)]+)\s*,/.exec(token);
  return match ? match[1].trim() : token;
};
const c = (name) => lightValue(tokens.colors[name]);

const COLORS = {
  primary: c('fg.accent.strong'),
  text: c('fg.default'),
  muted: c('fg.tertiary'),
  secondary: c('fg.secondary'),
  border: c('border.secondary'),
  borderSubtle: c('border.tertiary'),
  pageBg: c('bg.page'),
  cardBg: c('bg.secondary'),
  accentSubtle: c('bg.accent.subtle'),
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 12,
    marginBottom: 16,
  },
  hospitalBlock: {
    flexDirection: 'column',
    maxWidth: '60%',
  },
  hospitalName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  hospitalMeta: {
    fontSize: 9,
    color: COLORS.muted,
    lineHeight: 1.4,
  },
  doctorBlock: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    maxWidth: '40%',
  },
  doctorName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  doctorMeta: {
    fontSize: 9,
    color: COLORS.muted,
    textAlign: 'right',
    lineHeight: 1.4,
  },
  patientCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    backgroundColor: COLORS.cardBg,
  },
  patientField: {
    flexDirection: 'column',
    width: '25%',
    paddingVertical: 4,
    paddingRight: 8,
  },
  fieldLabel: {
    fontSize: 8,
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
  },
  rxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rxSymbol: {
    fontSize: 36,
    fontFamily: 'Times-Bold',
    color: COLORS.primary,
    marginRight: 12,
    lineHeight: 1,
  },
  rxHeader: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flex: 1,
    paddingTop: 12,
  },
  rxLabel: {
    fontSize: 9,
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rxTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
  },
  prescriptionBody: {
    minHeight: 320,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 6,
    backgroundColor: COLORS.accentSubtle,
    fontSize: 11,
    lineHeight: 1.6,
    color: COLORS.text,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  signatureBlock: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: 180,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: COLORS.text,
    width: '100%',
    marginBottom: 4,
    marginTop: 24,
  },
  signatureLabel: {
    fontSize: 8,
    color: COLORS.muted,
  },
  pageNumber: {
    fontSize: 8,
    color: COLORS.muted,
  },
});

const PatientField = ({ label, value }) => (
  <View style={styles.patientField}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value || 'N/A'}</Text>
  </View>
);

const PdfDocument = ({ pages }) => (
  <Document>
    {pages.map((page, pageIdx) => {
      const { hospitalData, doctorData, patientData, bodyData } = page;
      return (
        <Page key={pageIdx} size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.hospitalBlock}>
              <Text style={styles.hospitalName}>{hospitalData.Hospital || 'Hospital'}</Text>
              <Text style={styles.hospitalMeta}>
                {hospitalData.Branch ? `${hospitalData.Branch}\n` : ''}
                {hospitalData.Phone ? `Phone: ${hospitalData.Phone}\n` : ''}
                {hospitalData.Email ? `Email: ${hospitalData.Email}` : ''}
              </Text>
            </View>
            <View style={styles.doctorBlock}>
              <Text style={styles.doctorName}>Dr. {doctorData.Doctor || 'N/A'}</Text>
              <Text style={styles.doctorMeta}>
                {doctorData.Degree ? `${doctorData.Degree}\n` : ''}
                {doctorData.Department ? `${doctorData.Department}` : ''}
              </Text>
            </View>
          </View>

          <View style={styles.patientCard}>
            <PatientField label="Patient" value={patientData.Name} />
            <PatientField label="Gender" value={patientData.Gender} />
            <PatientField label="Age" value={patientData.Age} />
            <PatientField label="Blood Group" value={patientData['Blood Group']} />
            <PatientField label="Date" value={patientData.Date} />
          </View>

          <View style={styles.rxRow}>
            <Text style={styles.rxSymbol}>℞</Text>
            <View style={styles.rxHeader}>
              <Text style={styles.rxLabel}>Prescription</Text>
              <Text style={styles.rxTitle}>Recommended treatment</Text>
            </View>
          </View>

          <Text style={styles.prescriptionBody}>{bodyData.Prescription || 'No prescription details provided.'}</Text>

          <View style={styles.footer} fixed>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Doctor's Signature</Text>
            </View>
          </View>
        </Page>
      );
    })}
  </Document>
);

export default PdfDocument;
