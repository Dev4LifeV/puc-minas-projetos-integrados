"use client";

import DeliveryMethodSelectionStep, {
  DeliveryMethod,
} from "../_wizard-pages/DeliveryMethodSelectionStep";
import PaymentMethodStep, {
  PaymentMethodSelection,
} from "../_wizard-pages/PaymentMethodStep";
import { Wizard, useWizard } from "react-use-wizard";

import Address from "@/helpers/firestore/model/order/address";
import { Button } from "@mui/material";
import DeliveryAddressStep from "../_wizard-pages/DeliveryAddressStep";
import Item from "@/helpers/firestore/model/order/item";
import LoadingContainer from "@/components/basis/LoadingContainer";
import Order from "@/helpers/firestore/model/order/order";
import { OrderStatus } from "@/helpers/firestore/enum/order-status";
import { PaymentMethod } from "@/helpers/firestore/enum/payment-method";
import ProductSelectionStep from "../_wizard-pages/ProductSelectionStep";
import useOrders from "../hooks/useOrders";
import useProducts from "@/app/products/hooks/useProducts";
import { useRouter } from "next/navigation";
import useSetProduct from "@/app/products/hooks/useSetProduct";
import { useState } from "react";

type Step = {
  id: string;
  previousLabel: string | undefined;
  nextLabel: string;
  stepComponent: React.ReactNode;
  handleNextStep?: (nextStep: () => Promise<void>) => void;
};

const OrderWizardFooter = ({
  step,
  jumpTo,
  disableNextStep = false,
  backTo,
  handleNextStep,
  onLastStep,
}: {
  step: Omit<Step, "stepComponent">;
  jumpTo?: number;
  backTo?: number;
  disableNextStep?: boolean;
  handleNextStep?: (nextStep: () => Promise<void>) => void;
  onLastStep?: () => void;
}) => {
  const { nextStep, previousStep, isFirstStep, goToStep, isLastStep } =
    useWizard();

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 30,
      }}
    >
      <Button
        sx={{ visibility: !isFirstStep ? "visible" : "hidden" }}
        variant="contained"
        onClick={() => (backTo ? goToStep(backTo) : previousStep())}
      >
        {step.previousLabel}
      </Button>
      <Button
        disabled={disableNextStep}
        variant="contained"
        sx={{ position: "fixed", right: "32px" }}
        onClick={() => {
          if (handleNextStep) return handleNextStep(nextStep);

          if (jumpTo) {
            return goToStep(jumpTo);
          }

          if (isLastStep) {
            onLastStep?.();
            return;
          }

          nextStep();
        }}
      >
        {step.nextLabel}
      </Button>
    </footer>
  );
};

const OrderWizard = () => {
  const {
    products,
    loading: loadingProducts,
    error: errorProducts,
    useReadProducts,
  } = useProducts();

  const { error, loading, save } = useSetProduct();

  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>({
    id: "retirada",
    label: "Retirada",
  });
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodSelection>({
    id: "pix",
    label: "PIX",
  });

  const {
    createNewOrder,
    loading: loadingOrders,
    error: errorOrders,
  } = useOrders();

  const router = useRouter();

  const getPaymentMethod = (p: PaymentMethodSelection) => {
    switch (p.id) {
      case "pix":
        return PaymentMethod.pix;
      case "cash":
        return PaymentMethod.cash;
      case "creditCard":
        return PaymentMethod.creditCard;
      default:
        return PaymentMethod.creditCard;
    }
  };

  const steps: Omit<Step, "previousLabel" | "nextLabel">[] = [
    {
      id: "step-1",
      stepComponent: (
        <div>
          <ProductSelectionStep
            onRemoveItem={(product) => {
              setSelectedItems((prev) =>
                prev.filter((item) => item.product.id !== product.id)
              );
            }}
            selectedItems={selectedItems}
            itemsQuantity={selectedItems.length}
            onProductSelected={(item) => {
              if (selectedItems.find((i) => i.product.id === item.product.id)) {
                setSelectedItems((prev) => [
                  ...prev.filter((i) => i.product.id !== item.product.id),
                  item,
                ]);
                return;
              }
              setSelectedItems((prev) => [...prev, item]);
            }}
            products={products}
          />

          <OrderWizardFooter
            disableNextStep={selectedItems.length === 0}
            step={{
              id: "step-1",
              nextLabel: "Ir para entrega",
              previousLabel: undefined,
            }}
          />
        </div>
      ),
    },
    {
      id: "step-2",
      stepComponent: (
        <div>
          <DeliveryMethodSelectionStep
            deliveryMethod={deliveryMethod}
            onMethodSelected={(method) => {
              if (method.id === "retirada") {
                setAddress(null);
              }

              setDeliveryMethod(method);
            }}
          />
          <OrderWizardFooter
            jumpTo={deliveryMethod.id === "retirada" ? 3 : 2}
            step={{
              id: "step-2",
              nextLabel:
                deliveryMethod.id === "retirada"
                  ? "Ir para forma de pagamento"
                  : "Ir para endereço de entrega",
              previousLabel: "Retornar para items",
            }}
          />
        </div>
      ),
    },
    {
      id: "step-3",
      stepComponent: (
        <div>
          <DeliveryAddressStep address={address} onSubmit={setAddress} />
          <OrderWizardFooter
            step={{
              id: "step-3",
              nextLabel: "Ir para forma de pagamento",
              previousLabel: "Retornar para forma de entrega",
            }}
            disableNextStep={!address}
            handleNextStep={(nextStep) => {
              if (address) {
                nextStep();
              }
            }}
          />
        </div>
      ),
    },
    {
      id: "step-4",
      stepComponent: (
        <div>
          <PaymentMethodStep
            paymentMethod={paymentMethod}
            onMethodSelected={setPaymentMethod}
          />
          <OrderWizardFooter
            backTo={address != null ? 2 : 1}
            step={{
              id: "step-4",
              nextLabel: "Finalizar",
              previousLabel:
                address != null
                  ? "Retornar para dados de entrega"
                  : "Retornar para forma de entrega",
            }}
            onLastStep={() => {
              const date = new Date();

              const order = new Order(
                date.getTime().toString(),
                false,
                "Admin",
                address,
                selectedItems,
                "",
                date,
                OrderStatus.new,
                getPaymentMethod(paymentMethod),
                "NONE",
                ""
              );

              createNewOrder(order, () => {
                selectedItems.forEach(async (item) => {
                  item.product.inventory -= item.quantity;

                  save(item.product, item.product.category);
                });

                router.replace("/orders");
              });
            }}
          />
        </div>
      ),
    },
  ];

  useReadProducts();

  return (
    <>
      <LoadingContainer
        error={errorProducts !== null || errorOrders !== undefined}
        loading={loadingProducts || loadingOrders}
      >
        <Wizard>
          {steps.map((step) => (
            <div key={step.id}>{step.stepComponent}</div>
          ))}
        </Wizard>
      </LoadingContainer>
    </>
  );
};

export default function NewOrderWizard() {
  return <OrderWizard />;
}
