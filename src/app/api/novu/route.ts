// @ts-expect-error: Unreachable code error
import { serve } from "@novu/framework/next";
import {inviteWorkflow} from "@/app/novu/workflows/invite";
import {pairingWorkflow} from "@/app/novu/workflows/pairing";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
export const { GET, POST, OPTIONS } = serve({ workflows: [inviteWorkflow, pairingWorkflow] });
