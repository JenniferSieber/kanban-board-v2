import { Column } from "../types";

interface Props {
  column: Column;
}

function ColumnContainer({ column }: Props) {
  // const { column } = Props; destructure was not working adjustd the Props pass
  return (
    // <div className="columnBGColor w-1/4 h-auto max-h-screen flex gap-4">
    //     {column.title}
    // </div>

    // <div className="columnBGColor w-82 h-96 max-h-96 flex gap-4">
    
    <div className="flex flex-col rounded-md columnBGColor w-[350px] h-[500px] max-h-[500px] flex gap-4">
        {/* Column Title Container */}
        <header className="rounded-lg rounded-b-none bg-[#0D1117] p-3 font-bold text-md h-[60px] cursor-grab border-[#161C22] border-4">
            {column.title}
        </header>
        <section className="flex flex-grow">
            {/* Column Task Container */}
            tasks details
        </section>
        <footer className="footer">
            {/* Column Footer Container */}
            footer details
        </footer>
    </div>
  );
}

export default ColumnContainer;
