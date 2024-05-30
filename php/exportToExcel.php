<?php
include 'db_connection.php';

function formatPrice($price) {
    if (!empty(trim($price))) {
        $parsedPrice = floatval(str_replace(',', '.', $price));

        if (!is_nan($parsedPrice)) {
            $roundedPrice = number_format($parsedPrice, 2, '.', '');
            $formattedPrice = number_format($roundedPrice, 2, ',', '.') . ' €';
            return $formattedPrice;
        } else {
            return '';
        }
    } else {
        return '0,00 €';
    }
}

$sql = "SELECT Products.*, Categories.category_name, Tags.tag_name 
        FROM Products 
        JOIN Categories ON Products.category_ID = Categories.ID
        LEFT JOIN Tags ON Products.tag_ID = Tags.ID
        ORDER BY product_name ASC";

$result = mysqli_query($conn, $sql);

$filename = "products.xls";
header("Content-Type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename='.$filename'");

echo '<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">';
echo '<head><meta charset="utf-8">';
echo '<!--[if gte mso 9]>';
echo '<xml>';
echo '<x:ExcelWorkbook>';
echo '<x:ExcelWorksheets>';
echo '<x:ExcelWorksheet>';
echo '<x:Name>Tabelle 1</x:Name>';
echo '<x:WorksheetOptions>';
echo '<x:DisplayGridlines/>';
echo '<x:Zoom>125</x:Zoom>';
echo '</x:WorksheetOptions>';
echo '</x:ExcelWorksheet>';
echo '</x:ExcelWorksheets>';
echo '</x:ExcelWorkbook>';
echo '</xml>';
echo '<![endif]-->';
echo '</head>';

echo '<style>
.table {
    border: 1px solid #051C25;
    width: 100%;
    border-collapse: separate;
}
.table-header {
    height: 25px;
    background-color: #084051;
    color: #2BB8EE;
    vertical-align: middle;
    font-weight: bold;
    font-size: 14px;
    font-family: \'Aptos\';
    border: 0;
}
.table-row {
    height: 20px;
    vertical-align: middle;
    font-size: 12px;
    font-family: \'Aptos\';
    border: 0;
}
</style>';

echo '<table class="table">';

// Spaltenüberschriften
$columnMap = [
    'product_name' => 'Name',
    'amount' => 'Menge',
    'price' => 'Wert',
    'information' => 'Beschreibung',
    'category_name' => 'Kategorie',
    'tag_name' => 'Tag'
];

$flag = false;
$rowCount = 0;
while ($row = mysqli_fetch_assoc($result)) {
    if (!$flag) {
        // Header
        echo '<tr>';
        foreach ($columnMap as $key => $value) {
            if (array_key_exists($key, $row)) {
                $width = ($key == 'product_name' || $key == 'information' || $key == 'category_name' || $key == 'tag_name') ? '200px' : '70px';
                if ($key == 'amount' || $key == 'price') {
                    $textAlign = 'right';
                } elseif ($key == 'product_name' || $key == 'information' || $key == 'category_name' || $key == 'tag_name') {
                    $textAlign = 'left';
                }
                $paddingContent = str_repeat("&nbsp;", 2) . $value . str_repeat("&nbsp;", 2);
                echo "<th class='table-header' style='width: $width; text-align: $textAlign; border-bottom: 1px solid #051C25;'>$paddingContent</th>";
            }
        }
        echo '</tr>';
        $flag = true;
    }
    // Datenzeilen
    echo '<tr>';
    foreach ($columnMap as $key => $value) {
        if (array_key_exists($key, $row)) {
            $width = ($key == 'product_name' || $key == 'information' || $key == 'category_name' || $key == 'tag_name') ? '200px' : '70px';
            if ($key == 'amount' || $key == 'price') {
                    $textAlign = 'right';
                } elseif ($key == 'product_name' || $key == 'information' || $key == 'category_name' || $key == 'tag_name') {
                    $textAlign = 'left';
                }
            $backgroundColor = (($rowCount) % 2 == 0) ? '#ffffff' : '#97eafc';
            $cellContent = $key == 'price' ? formatPrice($row[$key]) : $row[$key];
            $paddingContent = str_repeat("&nbsp;", 3) . $cellContent . str_repeat("&nbsp;", 3);
            echo "<td class='table-row' style='width: $width; background-color: $backgroundColor; text-align: $textAlign;'>$paddingContent</td>";
        } 
    }
    echo '</tr>';
    $rowCount++;
}

$totalAmount = 0;
mysqli_data_seek($result, 0);
while ($row = mysqli_fetch_assoc($result)) {
    $totalAmount += $row['amount'];
}

// Abfrage für die Gesamtsumme
$totalValue = 0;
$resultTotal = mysqli_query($conn, "SELECT SUM(amount * price) AS total FROM Products");
if ($rowTotal = mysqli_fetch_assoc($resultTotal)) {
    $totalValue = $rowTotal['total'];
}

echo "<tr>
        <td style='border-top: 1px solid #051C25;' class='table-header' colspan='" . (count($columnMap) - 1) . "'>" . str_repeat("&nbsp;", 2) . "Anzahl der Produkte:" . str_repeat("&nbsp;", 2) . "</td>
        <td style='border-top: 1px solid #051C25; text-align: right;' class='table-header'>" . str_repeat("&nbsp;", 2) . $totalAmount . str_repeat("&nbsp;", 2) . "</td>
    </tr>";

echo "<tr>
        <td class='table-header' colspan='" . (count($columnMap) - 1) . "'>" . str_repeat("&nbsp;", 2) . "Gesamtwert:" . str_repeat("&nbsp;", 2) . "</td>
        <td style='text-align: right;' class='table-header'>" . str_repeat("&nbsp;", 2) . formatPrice($totalValue) . str_repeat("&nbsp;", 2) . "</td>
    </tr>";


echo '</table></body></html>';

mysqli_close($conn);
?>
