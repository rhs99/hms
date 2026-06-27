"""Add divisions/districts/thanas + branches.thana_id

Revision ID: a1d4f2c9b703
Revises: 13756df8b4e4
Create Date: 2026-06-27 19:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a1d4f2c9b703"
down_revision: Union[str, None] = "13756df8b4e4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "divisions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_table(
        "districts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("division_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["division_id"], ["divisions.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name", "division_id", name="u_ix_district_name_division"),
    )
    op.create_table(
        "thanas",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("district_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["district_id"], ["districts.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name", "district_id", name="u_ix_thana_name_district"),
    )
    op.add_column(
        "branches",
        sa.Column("thana_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_branches_thana_id_thanas",
        "branches",
        "thanas",
        ["thana_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_branches_thana_id_thanas", "branches", type_="foreignkey")
    op.drop_column("branches", "thana_id")
    op.drop_table("thanas")
    op.drop_table("districts")
    op.drop_table("divisions")
