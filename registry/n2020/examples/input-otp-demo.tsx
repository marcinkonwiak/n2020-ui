import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/registry/n2020/ui/input-otp";

export default function InputOtpDemo() {
  return (
    <InputOTP maxLength={6} defaultValue="482" aria-label="Verification code">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
