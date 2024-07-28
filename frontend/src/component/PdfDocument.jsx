import { Document, Page, Text, View, StyleSheet, Line, Svg } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'colum',
    backgroundColor: 'white',
  },
  section: {
    margin: 10,
    padding: 10,
  },
});

const PdfDocument = ({ hospitalData, doctorData, patientData, bodyData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {Object.keys(hospitalData).map((key, idx) => {
          return (
            <Text key={idx}>
              {key}: {hospitalData[key]}
            </Text>
          );
        })}
      </View>
      <Svg height="10" width="600">
        <Line x1="20" y1="5" x2="580" y2="5" strokeWidth={1} stroke="rgb(0,0,0)" />
      </Svg>
      <View style={styles.section}>
        {Object.keys(doctorData).map((key, idx) => {
          return (
            <>
              <Text key={idx}>
                {key}: {doctorData[key]}
              </Text>
              ;
            </>
          );
        })}
      </View>
      <Svg height="10" width="600">
        <Line x1="20" y1="5" x2="580" y2="5" strokeWidth={1} stroke="rgb(0,0,0)" />
      </Svg>
      <View style={styles.section}>
        {Object.keys(patientData).map((key, idx) => {
          return (
            <>
              <Text key={idx}>
                {key}: {patientData[key]}
              </Text>
              ;
            </>
          );
        })}
      </View>
      <Svg height="10" width="600">
        <Line x1="20" y1="5" x2="580" y2="5" strokeWidth={1} stroke="rgb(0,0,0)" />
      </Svg>
      <View style={styles.section}>
        {Object.keys(bodyData).map((key, idx) => {
          return (
            <>
              <Text>{bodyData[key]}</Text>;
            </>
          );
        })}
      </View>
    </Page>
  </Document>
);

export default PdfDocument;
