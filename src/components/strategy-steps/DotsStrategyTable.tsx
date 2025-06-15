
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DotsData {
  drivers: string[];
  opportunities: string[];
  threats: string[];
  strategicResponse: string[];
}

interface DotsStrategyTableProps {
  dotsData: DotsData | null;
}

const DotsStrategyTable = ({ dotsData }: DotsStrategyTableProps) => {
  if (!dotsData) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500">Click "Generate DOTS Strategy" to create your strategic vision framework.</p>
      </div>
    );
  }

  // Ensure all arrays exist and filter out empty strings
  const drivers = Array.isArray(dotsData.drivers) ? dotsData.drivers.filter(item => item && item.trim()) : [];
  const opportunities = Array.isArray(dotsData.opportunities) ? dotsData.opportunities.filter(item => item && item.trim()) : [];
  const threats = Array.isArray(dotsData.threats) ? dotsData.threats.filter(item => item && item.trim()) : [];
  const strategicResponse = Array.isArray(dotsData.strategicResponse) ? dotsData.strategicResponse.filter(item => item && item.trim()) : [];

  const maxRows = Math.max(
    drivers.length,
    opportunities.length,
    threats.length,
    strategicResponse.length,
    1 // Ensure at least 1 row
  );

  // If no data in any category, show a message
  if (maxRows === 1 && drivers.length === 0 && opportunities.length === 0 && threats.length === 0 && strategicResponse.length === 0) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
        <p className="text-yellow-700">DOTS strategy data appears to be empty. Try regenerating the strategy.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50">
            <TableHead className="font-bold text-purple-900 border-r border-gray-200">
              DRIVERS
              <p className="text-xs font-normal text-purple-700 mt-1">Internal & External Forces</p>
            </TableHead>
            <TableHead className="font-bold text-green-900 border-r border-gray-200">
              OPPORTUNITIES
              <p className="text-xs font-normal text-green-700 mt-1">Strategic Possibilities</p>
            </TableHead>
            <TableHead className="font-bold text-red-900 border-r border-gray-200">
              THREATS
              <p className="text-xs font-normal text-red-700 mt-1">Strategic Risks</p>
            </TableHead>
            <TableHead className="font-bold text-blue-900">
              STRATEGIC RESPONSE
              <p className="text-xs font-normal text-blue-700 mt-1">High-Level Themes</p>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: maxRows }, (_, index) => (
            <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <TableCell className="border-r border-gray-200 align-top p-4">
                <div className="text-sm text-gray-800">
                  {drivers[index] || ""}
                </div>
              </TableCell>
              <TableCell className="border-r border-gray-200 align-top p-4">
                <div className="text-sm text-gray-800">
                  {opportunities[index] || ""}
                </div>
              </TableCell>
              <TableCell className="border-r border-gray-200 align-top p-4">
                <div className="text-sm text-gray-800">
                  {threats[index] || ""}
                </div>
              </TableCell>
              <TableCell className="align-top p-4">
                <div className="text-sm text-gray-800 font-medium">
                  {strategicResponse[index] || ""}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DotsStrategyTable;
