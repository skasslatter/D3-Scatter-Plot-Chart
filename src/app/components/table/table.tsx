import React, { FC } from "react";
import "./table.css";
interface TableComponentProps {
  data: any[];
}

export const TableComponent: FC<TableComponentProps> = ({ data }) => {
  return (
    <>
      {data.length > 0 && (
        <div className="table">
          <div className="row">
            <span>Id</span>
            <span>CDR3 Nucleotides</span>
          </div>

          {data.slice(0, 10).map((tag) => {
            return (
              <div key={tag.id} className="row tags">
                <span>{tag.id}</span>
                <span>{tag["CDR3 Nucleotides"]}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
