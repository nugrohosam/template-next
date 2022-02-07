import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  section: {
    paddingVertical: 35,
    paddingHorizontal: 35,
  },
  rowImage: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  logo: {
    width: 41,
    height: 53,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  column: {
    width: '33.3%',
    marginBottom: 8,
  },
  infoBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  infoTitle: {
    fontSize: 11,
    color: '#2e75b5',
  },
  infoDesc: {
    fontSize: 11,
    fontWeight: 'extrabold',
  },
  signatureTitle: {
    fontSize: 10,
    textAlign: 'center',
  },
});

export const tableStyles = StyleSheet.create({
  table: {
    display: 'table',
    width: 'auto',
  },
  tableRow: {
    flexDirection: 'row',
  },
  firstTableColHeader: {
    width: '11.1%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    backgroundColor: '#bdbdbd',
  },
  tableColHeader: {
    width: '11.1%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    backgroundColor: '#bdbdbd',
  },
  firstTableCol: {
    width: '11.1%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderTopWidth: 0,
  },
  tableCol: {
    width: '11.1%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    textAlign: 'center',
    margin: 3,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableCell: {
    textAlign: 'center',
    margin: 4,
    fontSize: 8,
  },
});
