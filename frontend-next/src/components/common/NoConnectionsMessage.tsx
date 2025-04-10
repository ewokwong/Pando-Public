import React from "react";
import Link from "next/link";

interface NoConnectionsMessageProps {
  refreshPossibleConnections: () => void; // Function to refresh connections
}

const NoConnectionsMessage: React.FC<NoConnectionsMessageProps> = ({ refreshPossibleConnections }) => (
  <div className="NoConnectionsMessage">
    <p>Our Pando network is ever-growing, so please check back in daily for new accounts!</p>
    <Link
      href="#"
      onClick={refreshPossibleConnections}
      style={{ textDecoration: "underline", color: "#1976d2" }}>
      
        In the meantime, go through all of the profiles again
      
    </Link>
  </div>
);

export default NoConnectionsMessage;
