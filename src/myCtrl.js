// define app, include Wijmo 5 directives
var app = angular.module('myApp', ['wj']);


// controller
app.controller('myCtrl', function ($scope) {
    var input;
    var grid;
    var pdf;
    var gridPdf;

    angular.element(document).ready(function () {
        $scope.init();
    });

    $scope.init = function () {
        input = wijmo.input;
        grid = wijmo.grid;
        pdf = wijmo.pdf;
        gridPdf = wijmo.grid.pdf;

        $scope.scaleMode = gridPdf.ScaleMode.PageWidth;
        $scope.orientation = pdf.PdfPageOrientation.Portrait;
        $scope.exportMode = gridPdf.ExportMode.All;



        var menuScaleMode = new input.Menu('#lbScaleMode', {
            selectedIndexChanged: (s) => {
                if (s.selectedIndex >= 0) {
                    $scope.scaleMode = wijmo.asEnum(s.selectedValue, gridPdf.ScaleMode);
                    updateMenuHeader(s, 'Scale mode');
                }
            }
        });
        updateMenuHeader(menuScaleMode, 'Scale mode');

        //
        var menuOrientation = new input.Menu('#lbOrientation', {
            selectedIndexChanged: (s) => {
                if (s.selectedIndex >= 0) {
                    $scope.orientation = wijmo.asEnum(s.selectedValue, pdf.PdfPageOrientation);
                    updateMenuHeader(s, 'Orientation');
                }
            }
        });
        updateMenuHeader(menuOrientation, 'Orientation');

        //
        var menuExportMode = new input.Menu('#lbExportMode', {
            selectedIndexChanged: (s) => {
                if (s.selectedIndex >= 0) {
                    $scope.exportMode = wijmo.asEnum(s.selectedValue, gridPdf.ExportMode);
                    updateMenuHeader(s, 'Export mode');
                }
            }
        });
        updateMenuHeader(menuExportMode, 'Export mode');


        //
        $scope.myFlexGrid = new grid.FlexGrid('#flexGrid', {
            autoGenerateColumns: false,
            selectionMode: grid.SelectionMode.ListBox,
            headersVisibility: grid.HeadersVisibility.All,
            columns: [
                { header: 'ID', binding: 'id' },
                { header: 'Note', binding: 'note' },
                { header: 'Start Date', binding: 'start', format: 'd' },
                { header: 'End Date', binding: 'end', format: 'd' },
                { header: 'Country', binding: 'country' },
                { header: 'Product', binding: 'product' },
                { header: 'Amount', binding: 'amount', format: 'c', aggregate: 'Sum' },
                { header: 'Color', binding: 'color' },
                { header: 'Pending', binding: 'amount2', format: 'c2' },
                { header: 'Discount', binding: 'discount', format: 'p1' },
                { header: 'Active', binding: 'active' }
            ],
            itemsSource: getData(50)
        });
        //
        // set group setting for the flex grid
        setGrouping($scope.myFlexGrid);
        //


    };

    $scope.btnExport = function () {
        /* ----------------------------------------------------------------------- */
        var getFontName = function (path) {
            try {
                var fontName = (path.substring(path.lastIndexOf('/') + 1).split('.'))[0];
                return fontName;
            }
            catch (err) {
                return "";
            }
        };

        var font1 = "font/ipaexg.ttf";
        var font2 = "font/MeiryoUI-03.ttf";

        var fontName1 = getFontName(font1);
        var fontName2 = getFontName(font2);

        /* ----------------------------------------------------------------------- */
        var doc = new wijmo.pdf.PdfDocument({
            pageSettings: {
                layout: $scope.orientation,
                size: wijmo.pdf.PdfPageSize.A4,
                margins: {
                    left: 30,
                    top: 30,
                    right: 30,
                    bottom: 30
                }
            },
            header: {
                height: 50,
                declarative: {
                    text: 'Header日本語あいうえお９０１２３４５６７８９０①②③④⑤⑥⑦⑧⑨⑩日本語あいうえお９０１２３４５６７８９０①②③④⑤⑥⑦⑧⑨⑩日本語あいうえお９０１２３４５６７８９０①②③④⑤⑥⑦⑧⑨⑩ZZZ\t&[Page]\\&[Pages]',
                    font: new wijmo.pdf.PdfFont(fontName2, 12)
                }
            },
            footer: {
                height: 50,
                declarative: {
                    text: 'FLEX-200-①‐Flex Grid１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６E\t&[Page]\\&[Pages]\t\u00A92021 Sample. All Rights Reserved.',
                    font: new wijmo.pdf.PdfFont(fontName2, 10)
                }
            },
            info: {
                title: "",
                subject: "",
                author: "Sample",
                creationDate: new Date(),
                modDate: new Date(),
                keywords: ""
            },
            pageAdded: function (sender, args) {
            },
            ended: function (sender, args) {
                pdf.saveBlob(args.blob, "FlexGrid.pdf");
            }
        });

        /* ----------------------------------------------------------------------- */
        // register fonts
        var objFont = {};
        objFont[fontName1] = font1;
        objFont[fontName2] = font2;

        for (var fontName in objFont) {
            doc.registerFont({ source: objFont[fontName], name: fontName });
        }

        doc.registerFont({
            source: "font/ipaexg.ttf",
            name: "ipaexg",
        });

        /* ----------------------------------------------------------------------- */

        doc.setFont(new wijmo.pdf.PdfFont(fontName1, 20));

        /* ----------------------------------------------------------------------- */
        var exportSsettings = {
            exportMode: $scope.exportMode,
            scaleMode: $scope.scaleMode,
            customCellContent: true,
            styles: {
                cellStyle: {
                    backgroundColor: '#ffffff',
                    borderColor: '#c6c6c6'
                },
                altCellStyle: {
                    backgroundColor: '#f9f9f9'
                },
                groupCellStyle: {
                    backgroundColor: '#dddddd'
                },
                headerCellStyle: {
                    backgroundColor: '#eaeaea'
                }
            },
            formatItem: function (e) {
            }
        };

        /* ----------------------------------------------------------------------- */
        gridPdf.FlexGridPdfConverter.draw($scope.myFlexGrid, doc, null, null, exportSsettings);
        doc.end();
        /* ----------------------------------------------------------------------- */


        // gridPdf.FlexGridPdfConverter.export($scope.myFlexGrid, 'FlexGrid.pdf', {
        //     maxPages: 10,
        //     exportMode: $scope.exportMode,
        //     scaleMode: $scope.scaleMode,
        //     documentOptions: {
        //         pageSettings: {
        //             layout: $scope.orientation
        //         },
        //         header: {
        //             declarative: {
        //                 text: '\t&[Page]\\&[Pages]'
        //             }
        //         },
        //         footer: {
        //             declarative: {
        //                 text: '\t&[Page]\\&[Pages]'
        //             }
        //         }
        //     },
        //     styles: {
        //         cellStyle: {
        //             backgroundColor: '#ffffff',
        //             borderColor: '#c6c6c6'
        //         },
        //         altCellStyle: {
        //             backgroundColor: '#f9f9f9'
        //         },
        //         groupCellStyle: {
        //             backgroundColor: '#dddddd'
        //         },
        //         headerCellStyle: {
        //             backgroundColor: '#eaeaea'
        //         }
        //     }
        // });
    };

    //
    function setGrouping(flexGrid) {
        var groupNames = ['Product', 'Country', 'Amount'];
        //
        // get the collection view, start update
        var cv = flexGrid.collectionView;
        cv.beginUpdate();
        //
        // clear existing groups
        cv.groupDescriptions.clear();
        //
        // add new groups
        for (var i = 0; i < groupNames.length; i++) {
            var propName = groupNames[i].toLowerCase();
            //
            if (propName == 'amount') {
                // group amounts in ranges
                // (could use the mapping function to group countries into continents, 
                // names into initials, etc)
                var groupDesc = new wijmo.collections.PropertyGroupDescription(propName, (item, prop) => {
                    var value = item[prop];
                    if (value > 1000)
                        return 'Large Amounts';
                    if (value > 100)
                        return 'Medium Amounts';
                    if (value > 0)
                        return 'Small Amounts';
                    return 'Negative';
                });
                //
                cv.groupDescriptions.push(groupDesc);
            }
            else {
                if (propName) {
                    // group other properties by their specific values
                    var groupDesc = new wijmo.collections.PropertyGroupDescription(propName);
                    cv.groupDescriptions.push(groupDesc);
                }
            }
        }
        //
        // done updating
        cv.endUpdate();
    }
    function updateMenuHeader(menu, header) {
        menu.header = header + ': <b>' + menu.text + '</b>';
    }
});


