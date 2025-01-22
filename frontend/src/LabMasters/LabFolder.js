import React, { useState, useEffect } from "react";
import ResultEntryQueueList from "../Lab/ResultEntryQueueList";
import SampleCollectionQueue from "../Lab/SampleCollectionQueue";
import { useDispatch, useSelector } from 'react-redux'


const LabFolder = () => {

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu); 
  const dispatchvalue = useDispatch()

  const [activeFolder, setActiveFolder] = useState("SampleCollectionQueue");
  const [showFolders, setShowFolders] = useState(false);

  const handleFolderClick = (folderName) => {
     setActiveFolder(folderName); // Update the state to show the clicked folder's content
     dispatchvalue({ type: "showMenu", value: false }); 
   };
   // Trigger folder boxes animation when the component mounts
   // useEffect(() => {
   //   setShowFolders(true);
   // }, []);
   useEffect(() => {
     console.log(activeHrFolder, 'activeHrFolder');
 
     if (activeHrFolder !== "") {
       setActiveFolder(activeHrFolder)
       dispatchvalue({ type: 'HrFolder', value: '' })
     }
     setShowFolders(true);
   }, [activeHrFolder]);


  const renderFolderContent = () => {
    switch (activeFolder) {
      case "SampleCollectionQueue":
        return <SampleCollectionQueue />;
      case "ResultEntryQueueList":
        return <ResultEntryQueueList />;




      default:
        return null;
    }
  };
  return (
    <div className="folder-container">
      {/* <h2>Lab</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

    {showMenu && (    <div onClick={() => handleFolderClick("SampleCollectionQueue")}
          className="folder-box"> SampleCollection Queue</div>
  )}

     {showMenu &&  (  <div onClick={() => handleFolderClick("ResultEntryQueueList")}
          className="folder-box"> ResultEntry Queue</div>
  )}





      </div>

      {renderFolderContent()}
    </div>
  )
}

export default LabFolder