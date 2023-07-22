class TransactionHelper {
  static convertToIsoString(indianDateString) {
    const dateString = indianDateString;
    const [day, month, year] = dateString.split('/');
    const yearAdjusted = `20${year}`;
    return new Date(`${yearAdjusted}-${month}-${day}`).toISOString();
  }
  static sendForProcessing(transactions) {
    const formattedTransactions = [];
    transactions.forEach((transaction) => {
      if (transaction?.Narration?.startsWith('UPI')) {
        // UPI-WALTERS MOTOCORP-9962030407@OKBIZAXIS-UTIB0000000-318214659054-WALTER MOTORS SERV
        const [type, merchant, upiId, refId, transactionId, message] =
          transaction?.Narration?.split('-');
        const pushObj = {
          ...transaction,
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type,
          merchant,
          refId,
          transactionId,
          message,
        };
        formattedTransactions.push(pushObj);
      } else if (transaction?.Narration?.startsWith('IMPS')) {
        // IMPS-318311300219-CHANDRAMOHAN GROVE APARTMENT OWNER-KVBL-XXXXXXXXXXXX5123-RENT JUNE 2023
        const [type, refId, merchant, transactionId, message] =
          transaction?.Narration?.split('-');
        const pushObj = {
          ...transaction,
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type,
          merchant,
          refId,
          transactionId,
          message,
        };
        formattedTransactions.push(pushObj);
      } else if (transaction?.Narration?.startsWith('ACH D-')) {
        // ACH D- GROWW-H95CH88LF3KQ
        const autoDebitArray = transaction?.Narration?.split('-');
        const pushObj = {
          ...transaction,
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type: 'Auto',
          merchant: autoDebitArray[1],
          refId: autoDebitArray[2],
          transactionId: autoDebitArray[2],
          message: 'Auto Debit',
        };
        formattedTransactions.push(pushObj);
      } else if (transaction?.Narration?.startsWith('IB FUNDS TRANSFER CR')) {
        // IB FUNDS TRANSFER CR-50100173430868-ARAVIND S
        const ibArray = transaction?.Narration?.split('-');
        const pushObj = {
          ...transaction,
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type: 'IB',
          merchant: ibArray[2],
          refId: ibArray[1],
          transactionId: ibArray[1],
          message: 'Internal Transfer',
        };
        formattedTransactions.push(pushObj);
      } else if (transaction?.Narration?.startsWith('EMI')) {
        // EMI 456928849 CHQ S4569288490041 0723456928849
        const emiArray = transaction?.Narration?.split(' ');
        const pushObj = {
          ...transaction,
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type: 'Auto',
          merchant: emiArray[1],
          refId: emiArray[3],
          transactionId: emiArray[4],
          message: 'EMI Payment',
        };
        formattedTransactions.push(pushObj);
      } else if (transaction?.Narration?.startsWith('POS')) {
        // POS 416021XXXXXX0945 CHAI GALLI
        const posArray = transaction?.Narration?.split(' ');
        const [type] = posArray;
        const refId = posArray[1];
        const transactionId = posArray[1];
        const merchant = posArray.reduce((acc, item, index) => {
          if (index > 1) {
            acc += item + ' ';
          }
          return acc;
        }, '');
        const message = 'POS Transaction';
        const pushObj = {
          ...transaction,
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type,
          merchant,
          refId,
          transactionId,
          message,
        };
        formattedTransactions.push(pushObj);
      } else if (transaction?.Narration?.includes('SALARY')) {
        // A2AINT01-QUAKING ASPEN PRIVATE LIMITED-SALARY-SALARY
        const salArray = transaction?.Narration?.split('-');
        const type = 'NEFT';
        const refId = salArray[0];
        const transactionId = salArray[0];
        const merchant = salArray[1];
        const message = salArray[2];
        const pushObj = {
          ...transaction,
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type,
          merchant,
          refId,
          transactionId,
          message,
        };
        formattedTransactions.push(pushObj);
      } else if (transaction?.Narration === 'CREDIT INTEREST CAPITALISED') {
        // A2AINT01-QUAKING ASPEN PRIVATE LIMITED-SALARY-SALARY
        const type = 'NEFT';
        const refId = 'NA';
        const transactionId = 'NA';
        const merchant = 'Bank';
        const message = transaction.Narration;
        const pushObj = {
          ...transaction,
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type,
          merchant,
          refId,
          transactionId,
          message,
        };
        formattedTransactions.push(pushObj);
      } else if (transaction?.Narration?.startsWith('NEFT')) {
        // NEFT DR-SBIN0001857-ARAVIND S-NETBANK MUM-N193232547314779-LOAN EMI 1ST INST
        const neftArray = transaction?.Narration?.split('-');
        const type = 'NEFT';
        const refId = neftArray[1];
        const transactionId = neftArray[3];
        const merchant = neftArray[2];
        const message = neftArray[4];
        const pushObj = {
          ...transaction,
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type,
          merchant,
          refId,
          transactionId,
          message,
        };
        formattedTransactions.push(pushObj);
      } else if (transaction?.Narration?.startsWith('NWD')) {
        // NWD-416021XXXXXX0945-00956014-KANCHEEPURAM
        const nwdArray = transaction?.Narration?.split('-');
        const type = 'NWD';
        const refId = nwdArray[2];
        const transactionId = nwdArray[1];
        const merchant = nwdArray[3];
        const message = 'ATM Withdrawal';
        const pushObj = {
          ...transaction,
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type,
          merchant,
          refId,
          transactionId,
          message,
        };
        formattedTransactions.push(pushObj);
      } else {
        const transactionObj = {
          ...transaction,
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type: null,
          merchant: null,
          upiId: null,
          upiRefId: null,
          upiTransactionId: null,
          message: null,
        };
        formattedTransactions.push(transactionObj);
      }
    });
    return formattedTransactions;
  }
  static constructHDFCStatement(statementArray) {
    const transactionArray = [];
    if (statementArray?.length) {
      const formattedTransactions =
        TransactionHelper.sendForProcessing(statementArray);
      formattedTransactions.forEach((transaction) => {
        const { type, merchant, upiId, upiRefId, upiTransactionId, message } =
          transaction;
        const transObj = {
          clientId: '64af5502ef83bb8e6eb1f0bd',
          desc: transaction.Narration,
          category: null,
          credit: transaction['Credit Amount'],
          debit: transaction['Debit Amount'],
          date: TransactionHelper.convertToIsoString(transaction.Date),
          type,
          merchant,
          upiId,
          upiRefId,
          upiTransactionId,
          message,
        };
        transactionArray.push(transObj);
      });
    }

    return transactionArray;
  }
}
module.exports = TransactionHelper;
