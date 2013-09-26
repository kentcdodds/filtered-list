#filtered-list

A simple app where you can give it data from a csv, check things off, and export it as a csv.

##How to use

###1. Import data

Get a CSV file and open it in any text editor. Copy all of that text and past it into the Import Data text box. Press the "Import" button.

You will then see the headings for the content you imported, select the radio button that corresponds with the column you want to see in the search filter below.

###2. Search through data

Simply type and click or hit <kbd>enter</kbd> to add data to the export list. The search filter will search based on any data for a given row in the data you exported. For example, if you're data has names and phone numbers, you could display the names and search with the phone numbers. Clicking <kbd>enter</kbd> will cause the item at the top of the list to be added to the export list.

###3. Export Data

Once you've moved everything from the search column to the export column you can remove items with the similar search functionality and then click the "Export" button. This will place all of the data that has been added to the export list in a csv format in the export text field. Copy that and save it to a file and you'll have your data!

##Other stuff

###Local Storage

Because sometimes you may accidentally refresh your browser, if you're using a modern browser with local storage enabled, you can leave and come back later and all data will be saved where you left it. A nice feature I must say! To clear this, simply click either the "Clear Data Below" or "Clear All Data" button. The main difference between these buttons is that the "Clear Data Below" button will not clear the text field that contains the csv info you pasted in the first place.

##License

The MIT License (MIT)

Copyright (c) 2013 Kent C. Dodds

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
