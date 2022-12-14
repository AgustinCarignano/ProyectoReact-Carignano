import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../../services/firebaseService";
import { cartContext } from "../../Contexts/cartContext";
import Button from "../Button/Button";
import Input from "./Input";
import Loader from "../Loader/Loader";
import "./Checkout.css";

function Checkout() {
  const [buyerData, setBuyerData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
  });
  const [procesing, setProcesing] = useState(false);
  const { cart, cartTotalPrice, cleanCart } = useContext(cartContext);
  const Navigate = useNavigate();

  //Crea la orden para luego cargarla en firestore y redirije a la página de "seguimiento"
  async function handleCheckout(e) {
    e.preventDefault();
    setProcesing(true);
    const Order = {
      buyer: buyerData,
      items: cart.map((item) => {
        let product = {
          title: item.title,
          subTitle: item.subTitle,
          price: item.precioActual,
          cantidad: item.cantidad,
        };
        return product;
      }),
      total: cartTotalPrice(),
      date: new Date(),
    };
    console.log("orden creada");
    const OrderId = await createOrder(Order);
    cleanCart();
    setTimeout(() => {
      Navigate(`/pedidos/${OrderId}`);
    }, 3000);
  }

  //Guarda en el estado los valores de los input del formulario
  function handleOnChange(e) {
    const inputName = e.target.name;
    const copyOfBuyerData = { ...buyerData };
    copyOfBuyerData[inputName] = e.target.value;
    setBuyerData(copyOfBuyerData);
  }

  let disabled =
    buyerData.name === "" ||
    buyerData.surname === "" ||
    buyerData.email === "" ||
    buyerData.phone === "";

  if (procesing) {
    return (
      <div className="procesing">
        <h3>Estamos generando su pedido</h3>
        <Loader />
        <p>
          Podrá luego realizar el seguimiento con el ID de la compra o su Email
        </p>
        <small>El proceso solo tomará unos segundos...</small>
      </div>
    );
  }
  return (
    <div className="checkout">
      <h2 className="checkout-title">Proceso de compra</h2>
      {/* <div> */}
      <h3 className="checkout-subtitle">Resumen del pedido</h3>
      {cart.map((item) => {
        return (
          <div key={item.id} className="checkout-resume">
            <p>
              {item.title} <small>({item.subTitle})</small> x{item.cantidad}
            </p>
            <h5>${item.precioActual * item.cantidad}</h5>
          </div>
        );
      })}
      <h5 className="checkout-totalPirce">
        Total de la compra: ${cartTotalPrice()}
      </h5>
      {/* </div> */}
      <h3 className="checkout-subtitle">
        Complete el siguiente formulario con sus datos personales
      </h3>
      <form className="checkout-form" onSubmit={handleCheckout}>
        <Input
          inputName="name"
          inputType="text"
          label="Nombre"
          className="form-input"
          onChange={handleOnChange}
          value={buyerData.name}
        />
        <Input
          inputName="surname"
          inputType="text"
          label="Apellido"
          className="form-input"
          onChange={handleOnChange}
          value={buyerData.surname}
        />
        <Input
          inputName="email"
          inputType="email"
          label="Email"
          className="form-input"
          onChange={handleOnChange}
          value={buyerData.email}
        />
        <Input
          inputName="phone"
          inputType="text"
          label="Teléfono"
          className="form-input"
          onChange={handleOnChange}
          value={buyerData.phone}
        />
        <div className="form-buttons">
          <Link to="/cart">
            <Button text="Volver al carrito" show="normal" />
          </Link>
          <Button disabled={disabled} text="Finalizar compra" show="bigger" />
        </div>
      </form>
    </div>
  );
}

export default Checkout;
