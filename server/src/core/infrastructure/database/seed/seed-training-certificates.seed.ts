import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { TrainingCertificateEntity } from '@/features/201-management/infrastructure/database/entities/training-certificate.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { TRAINING_CERTIFICATES } from './data';

export class SeedTrainingCertificates {
  private readonly logger = new Logger(SeedTrainingCertificates.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    const defaultIssueDate = new Date('2020-01-01');
    const defaultOrg = 'HRIS Seed';

    for (const certificateName of TRAINING_CERTIFICATES) {
      const existing = await this.entityManager.findOne(
        TrainingCertificateEntity,
        {
          where: { certificate_name: certificateName },
          withDeleted: true,
        },
      );

      if (!existing) {
        const entity = this.entityManager.create(TrainingCertificateEntity, {
          certificate_name: certificateName,
          issuing_organization: defaultOrg,
          issue_date: defaultIssueDate,
          expiry_date: null,
          certificate_number: null,
          file_path: null,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created training certificate: ${certificateName}`);
      }
    }
  }
}
