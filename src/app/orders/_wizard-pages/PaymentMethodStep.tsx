import {
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

import { PaymentMethod } from "@/helpers/firestore/enum/payment-method";
import { themeVars } from "@/theme/theme.css";

export type PaymentMethodSelection = { id: string; label: string };

interface DeliveryMethodSelectionStepProps {
  onMethodSelected: (method: PaymentMethodSelection) => void;
  paymentMethod: PaymentMethodSelection;
}
export default function PaymentMethodStep({
  onMethodSelected,
  paymentMethod,
}: DeliveryMethodSelectionStepProps) {
  const methods: PaymentMethodSelection[] = Object.entries(PaymentMethod).map(
    ([id, label]) => ({
      id,
      label,
    })
  );

  console.log(methods);

  return (
    <Stack>
      <Typography
        variant="h4"
        textAlign="center"
        sx={{
          marginBottom: 4,
        }}
      >
        Selecione a forma de entrega
      </Typography>

      <RadioGroup
        value={paymentMethod.id}
        onChange={(e) => {
          const selected = {
            id: e.target.value,
            label: methods.find(({ id }) => id === e.target.value)?.label || "",
          };

          onMethodSelected(selected);
        }}
      >
        <Stack gap={2}>
          {methods.map(({ id, label }) => (
            <Card
              key={id}
              sx={{
                backgroundColor: themeVars.color.card,
                cursor: "pointer",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2}>
                  <Stack>
                    <FormControlLabel
                      control={<Radio />}
                      value={id}
                      label={<Typography variant="h6">{label}</Typography>}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </RadioGroup>
    </Stack>
  );
}
