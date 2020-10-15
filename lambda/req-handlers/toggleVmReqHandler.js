import { toggleVm } from '../../lib';
import { stringifyError } from '../../util';

export async function toggleVmReqHandler(req, res) {
  if (globalThis.TOGGLE_VM_OPERATION_LOCK) {
    res.status(409).send({
      success: false,
      reason: 'previous_operation_still_running',
    });
  } else {
    globalThis.TOGGLE_VM_OPERATION_LOCK = true;

    setTimeout(() => {
      globalThis.TOGGLE_VM_OPERATION_LOCK = false;
    }, 60 * 1000);

    try {
      const { operationType } = req.body;

      await toggleVm({ operationType });

      res.send({ success: true });
    } catch (error) {
      res.status(500).send({
        success: false,
        reason: 'error',
        error: stringifyError(error),
      });
    }

    globalThis.TOGGLE_VM_OPERATION_LOCK = false;
  }
}
