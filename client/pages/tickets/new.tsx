import React from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    data: { title, price },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
            onBlur={onBlur}
          />
        </div>

        {errors}

        <button type="submit" className="btn btn-primary"></button>
      </form>
    </div>
  );
};

export default NewTicket;
