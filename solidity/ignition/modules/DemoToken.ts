import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SUPPLY = 10000;

const TokenModule = buildModule("TokenModule", (m) => {
  const supply = m.getParameter("supply", SUPPLY);

  const token = m.contract("DemoUSDC", [supply]);

  return { token };
});

export default TokenModule;
