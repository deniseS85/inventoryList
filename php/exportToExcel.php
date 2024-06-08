<?php
session_start(); 
include 'db_connection.php';
require '/Applications/XAMPP/xamppfiles/htdocs/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

$user_id = $_SESSION['user_id'];

function formatPrice($price) {
    if (!empty(trim($price))) {
        $parsedPrice = floatval(str_replace(',', '.', $price));
        return $parsedPrice;
    } else {
        return 0.00;
    }
}

$sql = "SELECT Products.*, Categories.category_name, Tags.tag_name 
        FROM Products 
        JOIN Categories ON Products.category_ID = Categories.ID
        LEFT JOIN Tags ON Products.tag_ID = Tags.ID
        WHERE Products.user_id = $user_id 
        ORDER BY product_name ASC";

$result = mysqli_query($conn, $sql);
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

// Set column headers
$columnMap = [
    'product_name' => 'Name',
    'amount' => 'Menge',
    'price' => 'Wert',
    'information' => 'Beschreibung',
    'category_name' => 'Kategorie',
    'tag_name' => 'Tag'
];

$headerStyle = [
    'font' => ['bold' => true, 'size' => 14, 'name' => 'Aptos', 'color' => ['rgb' => '2BB8EE']],
    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '084051']]
];

$paddingStyle = [
    'product_name' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
    'amount' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT,
    'price' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT,
    'information' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
    'category_name' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
    'tag_name' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
];

// Tabellenheader
$col = 1;
foreach ($columnMap as $key => $value) {
    $width = ($key == 'product_name' || $key == 'information' || $key == 'category_name' || $key == 'tag_name') ? 33 : 11;
    $sheet->getColumnDimensionByColumn($col)->setWidth($width);
    $sheet->setCellValueByColumnAndRow($col, 1, $value);
    $sheet->getStyleByColumnAndRow($col, 1)->applyFromArray($headerStyle);
    if (array_key_exists($key, $paddingStyle)) {
        $sheet->getStyleByColumnAndRow($col, 1)->getAlignment()->setHorizontal($paddingStyle[$key]);
    }
    $sheet->getRowDimension(1)->setRowHeight(25);
    $sheet->getStyleByColumnAndRow($col, 1)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
    $sheet->getStyleByColumnAndRow($col, 1)->getAlignment()->setIndent(1);
    $col++;
}


// Datenzeilen
$row = 2;
$isEvenRow = false;
while ($row_data = mysqli_fetch_assoc($result)) {
    $col = 1;
    foreach ($columnMap as $key => $value) {
        $cellValue = $row_data[$key];
        if ($key == 'price') {
            $cellValue = formatPrice($cellValue);
            $sheet->setCellValueByColumnAndRow($col, $row, $cellValue);
            $sheet->getStyleByColumnAndRow($col, $row)->getNumberFormat()->setFormatCode('#,##0.00 €');
        } else {
            $sheet->setCellValueByColumnAndRow($col, $row, $cellValue);
        }
        $sheet->getRowDimension($row)->setRowHeight(20);
        $sheet->getStyleByColumnAndRow($col, $row)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->getStyleByColumnAndRow($col, $row)->getAlignment()->setIndent(1);

        if (array_key_exists($key, $paddingStyle)) {
            $sheet->getStyleByColumnAndRow($col, $row)->getAlignment()->setHorizontal($paddingStyle[$key]);
        }

        $backgroundColor = $isEvenRow ? 'FFFFFF' : '97EAFC';
        $sheet->getStyleByColumnAndRow($col, $row)->applyFromArray([
            'fill' => [
                'fillType' => Fill::FILL_SOLID, 
                'startColor' => ['rgb' => $backgroundColor]
            ],
            'font' => ['size' => 12, 'name' => 'Aptos']
        ]);
        
        $col++;
    }
    $row++;
    $isEvenRow = !$isEvenRow;
}

// Berechnung der Gesamtsumme und Anzahl der Produkte
$totalAmount = 0;
mysqli_data_seek($result, 0);
while ($row_data = mysqli_fetch_assoc($result)) {
    $totalAmount += $row_data['amount'];
}

$resultTotal = mysqli_query($conn, "SELECT SUM(amount * price) AS total FROM Products WHERE user_id = $user_id");
$totalValue = 0;
if ($rowTotal = mysqli_fetch_assoc($resultTotal)) {
    $totalValue = $rowTotal['total'];
}

// Gesamtzeilen
$sheet->setCellValueByColumnAndRow(1, $row, 'Anzahl der Produkte:');
$sheet->mergeCellsByColumnAndRow(1, $row, count($columnMap) - 1, $row);
$sheet->getStyleByColumnAndRow(1, $row)->applyFromArray($headerStyle);
$sheet->getRowDimension($row)->setRowHeight(25); 
$sheet->getStyleByColumnAndRow(1, $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$sheet->getStyleByColumnAndRow(1, $row)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$sheet->getStyleByColumnAndRow(1, $row)->getAlignment()->setIndent(1);

$sheet->setCellValueByColumnAndRow(count($columnMap), $row, $totalAmount);
$sheet->getStyleByColumnAndRow(count($columnMap), $row)->applyFromArray($headerStyle);
$sheet->getStyleByColumnAndRow(count($columnMap), $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$sheet->getStyleByColumnAndRow(count($columnMap), $row)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$sheet->getStyleByColumnAndRow(count($columnMap), $row)->getAlignment()->setIndent(1);

$row++;

$sheet->setCellValueByColumnAndRow(1, $row, 'Gesamtwert:');
$sheet->mergeCellsByColumnAndRow(1, $row, count($columnMap) - 1, $row);
$sheet->getStyleByColumnAndRow(1, $row)->applyFromArray($headerStyle);
$sheet->getRowDimension($row)->setRowHeight(25);
$sheet->getStyleByColumnAndRow(1, $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$sheet->getStyleByColumnAndRow(1, $row)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$sheet->getStyleByColumnAndRow(1, $row)->getAlignment()->setIndent(1);

$sheet->setCellValueByColumnAndRow(count($columnMap), $row, $totalValue);
$sheet->getStyleByColumnAndRow(count($columnMap), $row)->getNumberFormat()->setFormatCode('#,##0.00 €');
$sheet->getStyleByColumnAndRow(count($columnMap), $row)->applyFromArray($headerStyle);
$sheet->getStyleByColumnAndRow(count($columnMap), $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$sheet->getStyleByColumnAndRow(count($columnMap), $row)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$sheet->getStyleByColumnAndRow(count($columnMap), $row)->getAlignment()->setIndent(1);

$sheet->getSheetView()->setZoomScale(125);

$highestColumn = $sheet->getHighestColumn();
$highestRow = $sheet->getHighestRow();
$sheet->getStyle('A1:' . $highestColumn . $highestRow)->applyFromArray([
    'borders' => [
        'outline' => [
            'borderStyle' => Border::BORDER_MEDIUM,
            'color' => ['rgb' => '051C25']
        ]
    ]
]);

$sheet->setSelectedCell('A1');

// Save Excel file
$filename = "products.xlsx";
$writer = new Xlsx($spreadsheet);
$writer->save($filename);

// Download Excel file
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="' . $filename . '"');
header('Cache-Control: max-age=0');

$writer->save('php://output');

mysqli_close($conn);
?>
