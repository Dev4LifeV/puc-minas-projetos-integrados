import {
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

import { themeVars } from "@/theme/theme.css";

export type DeliveryMethod = { id: string; label: string };

interface DeliveryMethodSelectionStepProps {
  onMethodSelected: (method: DeliveryMethod) => void;
  deliveryMethod: DeliveryMethod;
}
export default function DeliveryMethodSelectionStep({
  onMethodSelected,
  deliveryMethod,
}: DeliveryMethodSelectionStepProps) {
  const methods: DeliveryMethod[] = [
    { id: "retirada", label: "Retirada" },
    { id: "entrega", label: "Entrega" },
  ];

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
        value={deliveryMethod.id}
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
