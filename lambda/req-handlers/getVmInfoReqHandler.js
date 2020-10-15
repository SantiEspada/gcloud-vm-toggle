import { getVmInfo } from '../../lib';
import { stringifyError } from '../../util';

export async function getVmInfoReqHandler(req, res) {
  try {
    const { name, status } = await getVmInfo();

    res.send({
      name,
      status,
    });
  } catch (error) {
    res.status(500).send({
      error: stringifyError(error),
    });
  }
}
