// import React, { Component, PropTypes } from 'react';
// import '../App.css'
// // import '..index.css'
// import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf';
// import Note from './Note'


// export default class Export extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             // note: {
//             //     id: this.props.note.id,
//             //     title: this.props.note.title,
//             //     content: this.props.note.content
//             // }
//         };
//     }

//     printDocument() {
//         // console.log(this.props.note);
//         const input = document.getElementById('divToPrint');
//         html2canvas(input)
//             .then((canvas) => {
//                 const imgData = canvas.toDataURL('image/png');
//                 const pdf = new jsPDF();
//                 pdf.addImage(imgData, 'JPEG', 0, 0);
//                 // pdf.output('dataurlnewwindow');
//                 pdf.save("download.pdf");
//             })
//             ;
//     }

//     render() {
//         return (
//                 <div>
//                 <div id="divToPrint" className="mt4" {
//                         ...StyleSheet({
//                         backgroundColor: '#f5f5f5',
//                         width: '210mm',
//                         minHeight: '297mm',
//                         marginLeft: 'auto',
//                         marginRight: 'auto'
//                     })
//                      }>
//                         Note: Here the dimensions of div are same as A4 You Can add any component here
//             </div>
//                     <button onClick={this.printDocument}>Print</button>
//                 </div>

//         );
//     }
// }