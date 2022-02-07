/* eslint-disable jsx-a11y/alt-text */
import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import {
  AccruedItem,
  AccruedItemHeader,
} from 'modules/accrueAdjustment/child/entities';
import React from 'react';

import { styles, tableStyles } from './Styles';

interface PropsPrint {
  header?: AccruedItemHeader;
  items?: AccruedItem[];
}

const AccruedItemPrint: React.FC<PropsPrint> = ({
  header,
  items,
}: PropsPrint) => {
  return (
    <Document>
      <Page size="A4">
        <View style={styles.section}>
          {/* LOGO IMAGE */}
          <View style={styles.rowImage}>
            <Image src="/images/logopama.png" style={styles.logo} />
          </View>
          {/* TITLE DOCUMENT */}
          <Text style={styles.title}>Form Accrued ACP / NON ACP</Text>
          {/* INFO SECTION */}
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={{ paddingHorizontal: '6px' }}>
                <Text style={styles.infoTitle}>Site</Text>
                <Text style={[styles.infoDesc, styles.infoBorder]}>
                  {header?.district}
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={{ paddingHorizontal: '6px' }}>
                <Text style={styles.infoTitle}>Dept</Text>
                <Text style={[styles.infoDesc, styles.infoBorder]}>
                  {header?.department}
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={{ paddingHorizontal: '6px' }}>
                <Text style={styles.infoTitle}>Jenis Cost</Text>
                <Text style={[styles.infoDesc, styles.infoBorder]}>
                  {header?.coaCode}
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={{ paddingHorizontal: '6px' }}>
                <Text style={styles.infoTitle}>Description</Text>
                <Text style={[styles.infoDesc, styles.infoBorder]}>
                  {header?.coaDesc}
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={{ paddingHorizontal: '6px' }}>
                <Text style={styles.infoTitle}>Periode</Text>
                <Text style={[styles.infoDesc, styles.infoBorder]}>
                  {header?.period}
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={{ paddingHorizontal: '6px' }}>
                <Text style={styles.infoTitle}>Tgl</Text>
                <Text style={[styles.infoDesc, styles.infoBorder]}>
                  {header?.date}
                </Text>
              </View>
            </View>
          </View>
          {/* TABLE SECTION */}
          <View style={styles.row}>
            <View style={tableStyles.table}>
              {/* TABLE HEADER */}
              <View style={tableStyles.tableRow}>
                <View style={tableStyles.firstTableColHeader}>
                  <Text style={tableStyles.tableCellHeader}>Supplier</Text>
                </View>
                <View style={tableStyles.tableColHeader}>
                  <Text style={tableStyles.tableCellHeader}>Activities</Text>
                </View>
                <View style={tableStyles.tableColHeader}>
                  <Text style={tableStyles.tableCellHeader}>Equip No (CN)</Text>
                </View>
                <View style={tableStyles.tableColHeader}>
                  <Text style={tableStyles.tableCellHeader}>
                    Doc Number (PR, WR, NOI, dll)
                  </Text>
                </View>
                <View style={tableStyles.tableColHeader}>
                  <Text style={tableStyles.tableCellHeader}>Quantum</Text>
                </View>
                <View
                  style={[
                    tableStyles.tableColHeader,
                    {
                      width: '22.2%',
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    },
                  ]}
                >
                  <View style={{ width: '100%' }}>
                    <Text style={tableStyles.tableCellHeader}>EOM</Text>
                  </View>
                  <View
                    style={[tableStyles.firstTableColHeader, { width: '50%' }]}
                  >
                    <Text style={tableStyles.tableCellHeader}>
                      Total in IDR ACP
                    </Text>
                  </View>
                  <View style={[tableStyles.tableColHeader, { width: '50%' }]}>
                    <Text style={tableStyles.tableCellHeader}>
                      Total in IDR NON ACP
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    tableStyles.tableColHeader,
                    {
                      width: '22.2%',
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    },
                  ]}
                >
                  <View style={{ width: '100%' }}>
                    <Text style={tableStyles.tableCellHeader}>MTD</Text>
                  </View>
                  <View
                    style={[tableStyles.firstTableColHeader, { width: '50%' }]}
                  >
                    <Text style={tableStyles.tableCellHeader}>
                      Total in IDR ACP
                    </Text>
                  </View>
                  <View style={[tableStyles.tableColHeader, { width: '50%' }]}>
                    <Text style={tableStyles.tableCellHeader}>
                      Total in IDR NON ACP
                    </Text>
                  </View>
                </View>
              </View>
              {/* TABLE DATA */}
              {items?.length !== 0 &&
                items?.map((item: AccruedItem, index: number) => (
                  <View style={tableStyles.tableRow} key={index}>
                    <View style={tableStyles.firstTableCol}>
                      <Text style={tableStyles.tableCell}>
                        {item.supplierName}
                      </Text>
                    </View>
                    <View style={tableStyles.tableCol}>
                      <Text style={tableStyles.tableCell}>
                        {item.activities}
                      </Text>
                    </View>
                    <View style={tableStyles.tableCol}>
                      <Text style={tableStyles.tableCell}>
                        {item.equipNumber}
                      </Text>
                    </View>
                    <View style={tableStyles.tableCol}>
                      <Text style={tableStyles.tableCell}>
                        {item.documentNumber}
                      </Text>
                    </View>
                    <View style={tableStyles.tableCol}>
                      <Text style={tableStyles.tableCell}>{item.quantum}</Text>
                    </View>
                    <View style={tableStyles.tableCol}>
                      <Text style={tableStyles.tableCell}>
                        {item.acpEom.toLocaleString('id-Id')}
                      </Text>
                    </View>
                    <View style={tableStyles.tableCol}>
                      <Text style={tableStyles.tableCell}>
                        {item.nonAcpEom?.toLocaleString('id-Id')}
                      </Text>
                    </View>
                    <View style={tableStyles.tableCol}>
                      <Text style={tableStyles.tableCell}>
                        {item.acpMtd.toLocaleString('id-Id')}
                      </Text>
                    </View>
                    <View style={tableStyles.tableCol}>
                      <Text style={tableStyles.tableCell}>
                        {item.nonAcpMtd?.toLocaleString('id-Id')}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
          {/* SIGNATURE SECTION */}
          <View style={{ marginTop: '40px' }}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.signatureTitle}>PIC Cost</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.signatureTitle}>
                  Atasan creator Sec / dept Head
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.signatureTitle}>PM Site</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default AccruedItemPrint;
