import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Options = () => {
  const [status, setStatus] = useState<string>();
  const [prefix, setPrefix] = useState<string>();
  const [separator, setSeparator] = useState<string>();

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        prefix: "SET PREFIX",
        separator: "-"
      },
      (items) => {
        setPrefix(items.prefix);
        setSeparator(items.separator);
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        prefix: prefix,
        separator: separator
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus(undefined);
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  const handlePrefixChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setPrefix(event.target.value);
  };

  const handleSeparatorChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSeparator(event.target.value);
  };

  return (
    <>
      <div>
        <label>
          Prefix:
          <input type="text" name="prefix" value={prefix} onChange={handlePrefixChange}>
          </input>
        </label>
      </div>
      <div>
        <label>
          Separator:
          <input type="text" name="separator" value={separator} onChange={handleSeparatorChange}>
          </input>
        </label>
      </div>
      <div>{status}</div>
      <button onClick={saveOptions}>Save</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
