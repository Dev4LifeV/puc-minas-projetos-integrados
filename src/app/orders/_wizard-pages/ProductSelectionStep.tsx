import { Add, Liquor, Remove } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  FormLabel,
  IconButton,
  Input,
  Snackbar,
  SnackbarContent,
  Stack,
  Typography,
  colors,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import Item from "@/helpers/firestore/model/order/item";
import { themeVars } from "@/theme/theme.css";
import Image from "next/image";
import { Product } from "../../../helpers/firestore/model/product/product";

interface ProductionSelectionStepProps {
  products: Product[];
  onProductSelected: (product: Item) => void;
  itemsQuantity: number;
  selectedItems: Item[];
  onRemoveItem: (product: Product) => void;
}

export default function ProductSelectionStep({
  products,
  onProductSelected,
  itemsQuantity,
  selectedItems,
  onRemoveItem,
}: ProductionSelectionStepProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const isProductSelected = useCallback(
    (product: Product): Item | undefined =>
      selectedItems.find((item) => item.product.id === product.id),
    [selectedItems]
  );

  useEffect(() => {
    if (!selectedProduct) return;

    setQuantity(isProductSelected(selectedProduct)?.quantity || 0);
  }, [isProductSelected, selectedProduct]);

  const incrementQuantity = () => {
    if (!selectedProduct) return;

    if (quantity <= selectedProduct?.inventory) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Stack gap={4}>
      <Typography textAlign="center" variant="h4">
        Selecione os itens do pedido
      </Typography>
      {products.map((product) => (
        <Card
          onClick={() => {
            setOpenDialog(true);
            setSelectedProduct(product);
          }}
          key={product.id}
          sx={{
            cursor: "pointer",
            backgroundColor: themeVars.color.card,
            border: isProductSelected(product)
              ? `2px solid ${colors.blue[500]}`
              : "none",
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2}>
              {product.image ? (
                <Image
                  style={{
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                  src={product.image}
                  alt={product.description}
                  width={100}
                  height={100}
                />
              ) : (
                <Liquor height={100} width={100} />
              )}
              <Stack>
                <Typography variant="h6">{product.description}</Typography>
                <Typography variant="body1">
                  {product.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
                <Typography variant="body1">
                  Quantidade em estoque: {product.inventory}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
      <Dialog
        onClose={() => {
          setOpenDialog(false);
          setSelectedProduct(null);
        }}
        open={openDialog && selectedProduct !== null}
      >
        {selectedProduct && (
          <>
            <DialogContent
              sx={{
                backgroundColor: themeVars.color.background,
              }}
            >
              <Stack gap={2}>
                {selectedProduct && selectedProduct?.image ? (
                  <Image
                    style={{
                      objectFit: "cover",
                    }}
                    width={400}
                    height={200}
                    alt={selectedProduct?.description}
                    src={selectedProduct?.image}
                  />
                ) : (
                  <Liquor
                    sx={{
                      fontSize: 300,
                    }}
                  />
                )}
                <Typography variant="h5">
                  {selectedProduct?.description}
                </Typography>
                <Stack>
                  <Typography variant="body1">
                    Valor unitário{" "}
                    {selectedProduct?.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                  <Typography variant="body1">
                    Quantidade em estoque {selectedProduct?.inventory}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <IconButton onClick={decrementQuantity}>
                    <Remove />
                  </IconButton>
                  <FormLabel
                    sx={{
                      color: "white",
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    Quantidade{" "}
                    <Input
                      sx={{
                        color: "white",

                        "::after, ::before": {
                          borderWidth: "2px",
                          borderBottomColor: "white",
                        },
                        ":hover:not(.Mui-disabled, .Mui-error):before": {
                          borderWidth: "2px",
                          borderBottomColor: "white",
                        },
                      }}
                      type="number"
                      value={quantity}
                      readOnly
                    />
                  </FormLabel>
                  <IconButton onClick={incrementQuantity}>
                    <Add />
                  </IconButton>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions
              sx={{
                backgroundColor: themeVars.color.background,
              }}
            >
              {isProductSelected(selectedProduct) && (
                <Button
                  sx={{
                    backgroundColor: "red",
                  }}
                  variant="contained"
                  onClick={() => {
                    onRemoveItem(selectedProduct);
                    setQuantity(0);
                    setSelectedProduct(null);
                    setOpenDialog(false);
                  }}
                >
                  Remover item
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => {
                  setOpenDialog(false);
                  setSelectedProduct(null);
                  setQuantity(0);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                disabled={quantity === 0}
                onClick={() => {
                  onProductSelected(
                    new Item(
                      new Date().toISOString(),
                      selectedProduct!,
                      quantity,
                      selectedProduct!.value * quantity,
                      ""
                    )
                  );
                  setQuantity(0);
                  setSelectedProduct(null);
                  setOpenDialog(false);
                }}
              >
                Adicionar ao pedido
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={itemsQuantity > 0}
        autoHideDuration={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <SnackbarContent
            message="Itens adicionados ao pedido aparecerão com uma borda azul."
            style={{
              backgroundColor: colors.blue[500],
            }}
          />
          <SnackbarContent
            message={`Itens adicionados ao pedido: ${itemsQuantity}`}
            style={{
              backgroundColor: colors.blue[500],
            }}
          />
        </div>
      </Snackbar>
    </Stack>
  );
}
