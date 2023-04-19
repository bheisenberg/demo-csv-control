import * as React from 'react';
import { DetailsList, IColumn, Label, SelectionMode } from '@fluentui/react';
import * as CSV from '@brisenberg/csv-string-nostream'

export interface ICSVProps {
  commaSeparatedValues?: string;
}

export const CSVControl: React.FC<ICSVProps> = (props: ICSVProps) => {
  const [columns, setColumns] = React.useState<IColumn[]>();
  const [items, setItems] = React.useState<Record<string, string>[]>();

  React.useEffect(() => {
    convertValuesToList();
  }, [props.commaSeparatedValues])

  const convertValuesToList = (): void => {
    // Parse the CSV string into an array of arrays (lines)
    var lines = CSV.parse(props.commaSeparatedValues ?? '');
    // Extract headers (first line) from the lines array
    const headers = lines[0];
    // Map headers to table columns (IColumn objects)
    const tableColumns: IColumn[] = headers.map(line => {
      return { key: `${lines[0].indexOf(line)}`, name: line, fieldName: line, minWidth: 200, maxWidth: 300 };
    });
    // Set the state for columns
    setColumns(tableColumns);

    // Map the rest of the lines to items (objects with header-value pairs)
    const items = lines.slice(1)!.map(line => {
      var obj: Record<string, string> = {};
      for (var i = 0; i < line.length; i++) {
        obj[headers[i]] = line[i];
      }
      return obj;
    });

    // Set the state for items
    setItems(items);
  }

  return (
    <DetailsList
      items={items || []}
      columns={columns}
      selectionMode={SelectionMode.none}
    />
  )
}