/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Button, InputField, SelectField } from '@invoiceninja/forms';
import { defaultRule } from 'common/constants/rules';
import { Rule, TransactionRule } from 'common/interfaces/transaction-rules';
import { ValidationBag } from 'common/interfaces/validation-bag';
import { Modal } from 'components/Modal';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHandleChange } from '../hooks/useHandleChange';

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  transactionRule: TransactionRule;
  setTransactionRule: Dispatch<SetStateAction<TransactionRule | undefined>>;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  ruleIndex: number;
}

export function RuleModal(props: Props) {
  const [t] = useTranslation();

  const {
    visible,
    setVisible,
    transactionRule,
    ruleIndex,
    setTransactionRule,
    setErrors,
  } = props;

  const [rule, setRule] = useState<Rule>(defaultRule);

  const handleChange = useHandleChange({ setTransactionRule, setErrors });

  const handleChangeRule = (property: keyof Rule, value: Rule[keyof Rule]) => {
    setRule((currentRule) => ({
      ...currentRule,
      [property]: value,
    }));
  };

  const handleAddRule = () => {
    if (rule) {
      const alreadyAddedRules = transactionRule.rules || [];

      if (ruleIndex > -1) {
        alreadyAddedRules[ruleIndex] = rule;
        handleChange('rules', alreadyAddedRules);
        setRule(defaultRule);
        setVisible(false);
      } else {
        handleChange('rules', [...alreadyAddedRules, rule]);
        setRule(defaultRule);
        setVisible(false);
      }
    }
  };

  useEffect(() => {
    if (transactionRule) {
      if (ruleIndex > -1) {
        setRule(transactionRule.rules[ruleIndex]);
      }
    }
  }, [transactionRule]);

  return (
    <Modal
      title={t('add_rule')}
      visible={visible}
      onClose={() => setVisible(false)}
    >
      <SelectField
        required
        label={t('field')}
        value={rule.field}
        onValueChange={(value) => handleChangeRule('field', value)}
      >
        <option defaultChecked value="description">
          {t('description')}
        </option>
        <option value="amount">{t('amount')}</option>
      </SelectField>

      <SelectField
        required
        label={t('operator')}
        value={rule.operator}
        onValueChange={(value) => handleChangeRule('operator', value)}
      >
        <option defaultChecked value="contains">
          {t('contains')}
        </option>
        <option value="starts_with">{t('starts_with')}</option>
        <option value="is">{t('is')}</option>
        <option value="is_empty">{t('is_empty')}</option>
      </SelectField>

      <InputField
        required
        label={t('value')}
        value={rule.value}
        onValueChange={(value) => handleChangeRule('value', value)}
      />

      <Button
        className="self-end"
        onClick={handleAddRule}
        disableWithoutIcon
        disabled={!rule.value}
      >
        {t('save')}
      </Button>
    </Modal>
  );
}
