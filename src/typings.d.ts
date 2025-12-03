declare module 'jspdf-autotable' {
    import 'jspdf';
  
    declare module 'jspdf' {
      interface jsPDF {
        lastAutoTable: {
          finalY: number;
        };
      }
    }
  
    export default function autoTable(
      doc: jsPDF,
      options: any
    ): jsPDF;
  }
  